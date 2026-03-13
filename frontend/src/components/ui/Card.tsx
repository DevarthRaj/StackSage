import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-2xl border border-white/[0.08] p-6",
                variant === "glass" ? "bg-white/[0.03] backdrop-blur-sm" : "bg-white/[0.03]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
