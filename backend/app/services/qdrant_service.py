"""
Qdrant Service — handles all vector database operations.

Concepts to understand:
- Collection: like a table in SQL, but stores vectors
- Vector: a list of numbers representing the meaning of text
- Payload: metadata stored alongside each vector (source, date, text etc.)
- Upsert: insert if not exists, update if exists (by ID)
"""

import hashlib
from typing import Optional
from qdrant_client import QdrantClient, AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from app.config import settings


def get_qdrant_client() -> QdrantClient:
    """
    Returns a synchronous Qdrant client.
    Used for setup operations like creating collections.

    Why synchronous here? Collection creation happens once at startup,
    not inside async request handlers, so sync is fine.
    """
    return QdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
    )


def get_async_qdrant_client() -> AsyncQdrantClient:
    """
    Returns an async Qdrant client.
    Used inside FastAPI endpoints and async functions
    so we don't block the event loop during DB operations.
    """
    return AsyncQdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
    )


def setup_qdrant_collection() -> None:
    """
    Creates the Qdrant collection if it doesn't already exist.
    Safe to call multiple times — checks existence first.

    A collection needs to know:
    - size: how many dimensions each vector has (768 for Google's model)
    - distance: how to measure similarity between vectors
      COSINE = measures angle between vectors, best for text similarity
      DOT = measures magnitude + direction, good for recommendations
      EUCLIDEAN = measures straight-line distance, less common for text
    """
    client = get_qdrant_client()

    # Get list of existing collections
    existing = [c.name for c in client.get_collections().collections]

    if settings.qdrant_collection_name not in existing:
        client.create_collection(
            collection_name=settings.qdrant_collection_name,
            vectors_config=VectorParams(
                size=settings.embedding_dimension,  # 768 for text-embedding-004
                distance=Distance.COSINE,
            ),
        )
        print(f"✅ Created Qdrant collection: {settings.qdrant_collection_name}")
    else:
        print(f"ℹ️  Collection already exists: {settings.qdrant_collection_name}")


def make_point_id(url: str, chunk_index: int) -> str:
    """
    Generates a deterministic unique ID for each document chunk.

    Why MD5 hash? Qdrant needs a unique ID per point. Using a hash of
    (url + chunk_index) means the same document always gets the same ID.
    This enables upsert deduplication — if we scrape the same page twice,
    we update the existing point instead of creating a duplicate.

    Interview question: Why not just use a random UUID?
    Answer: Random UUIDs can't deduplicate. Same content scraped twice
    would create two separate points in the DB.
    """
    raw = f"{url}_{chunk_index}"
    return hashlib.md5(raw.encode()).hexdigest()


async def upsert_documents(
    documents: list[dict],
    embeddings: list[list[float]],
) -> None:
    """
    Stores document chunks + their vector embeddings in Qdrant.

    Args:
        documents: list of dicts with keys:
                   text, source, date_ingested, category, url
        embeddings: list of vectors, same length as documents
                    each vector corresponds to the document at the same index

    Why upsert not insert?
    Upsert = update if exists, insert if not.
    This means we can re-run scrapers without creating duplicates.
    """
    client = get_async_qdrant_client()

    points = []
    for i, (doc, vector) in enumerate(zip(documents, embeddings)):
        point_id = make_point_id(doc["url"], i)

        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    # The actual text chunk — returned when we search
                    "text": doc["text"],
                    # Metadata for filtering and display
                    "source": doc.get("source", "unknown"),
                    "url": doc.get("url", ""),
                    "category": doc.get("category", "general"),
                    "date_ingested": doc.get("date_ingested", ""),
                    # Hardware requirements if this doc is about a specific tool
                    "min_ram_gb": doc.get("min_ram_gb", 0),
                    "min_vram_gb": doc.get("min_vram_gb", 0),
                    "requires_gpu": doc.get("requires_gpu", False),
                    "free": doc.get("free", True),
                },
            )
        )

    # Upload in batches of 100 to avoid timeout on large datasets
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        await client.upsert(
            collection_name=settings.qdrant_collection_name,
            points=batch,
        )
        print(f"✅ Upserted batch {i // batch_size + 1} ({len(batch)} points)")


async def search_documents(
    query_vector: list[float],
    limit: int = 10,
    category_filter: Optional[str] = None,
) -> list[dict]:
    """
    Searches Qdrant for the most similar documents to a query vector.

    Args:
        query_vector: the embedded version of the user's question
        limit: how many results to return
        category_filter: optionally filter by category (e.g. "LLM")

    Returns list of dicts with 'text', 'source', 'score' and other metadata.

    The 'score' is the cosine similarity — ranges from 0 to 1.
    Higher score = more similar to the query.
    """
    client = get_async_qdrant_client()

    # Build optional category filter
    # This is like a WHERE clause in SQL
    search_filter = None
    if category_filter:
        search_filter = Filter(
            must=[
                FieldCondition(
                    key="category",
                    match=MatchValue(value=category_filter),
                )
            ]
        )

    results = await client.search(
        collection_name=settings.qdrant_collection_name,
        query_vector=query_vector,
        limit=limit,
        query_filter=search_filter,
        with_payload=True,  # Include the metadata in results
    )

    # Convert Qdrant result objects to plain dicts
    return [
        {
            "text": r.payload.get("text", ""),
            "source": r.payload.get("source", ""),
            "url": r.payload.get("url", ""),
            "category": r.payload.get("category", ""),
            "score": r.score,
            "min_ram_gb": r.payload.get("min_ram_gb", 0),
            "min_vram_gb": r.payload.get("min_vram_gb", 0),
            "requires_gpu": r.payload.get("requires_gpu", False),
            "free": r.payload.get("free", True),
        }
        for r in results
    ]