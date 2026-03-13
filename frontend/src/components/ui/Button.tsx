import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-ring touch-target",
    {
        variants: {
            variant: {
                primary: "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25",
                accent: "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25",
                secondary: "border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:border-white/20",
                ghost: "text-zinc-400 hover:text-emerald-400",
                outline: "border border-white/10 text-zinc-300 hover:border-white/20 hover:text-zinc-100",
            },
            size: {
                default: "px-6 py-3",
                sm: "px-4 py-2",
                lg: "px-8 py-4 text-base",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
    return (
        <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {children}
        </button>
    );
}

export { buttonVariants };
