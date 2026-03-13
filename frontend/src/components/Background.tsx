interface BackgroundProps {
    variant?: "default" | "minimal";
}

export function Background({ variant = "default" }: BackgroundProps) {
    return (
        <>
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[128px]" />
            {variant === "default" && (
                <div className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/[0.06] blur-[96px]" />
            )}
        </>
    );
}
