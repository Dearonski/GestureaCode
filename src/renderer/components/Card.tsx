import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={twMerge(
                `bg-neutral-300 dark:bg-zinc-900 p-3 rounded-2xl border border-neutral-400 dark:border-zinc-800`,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
