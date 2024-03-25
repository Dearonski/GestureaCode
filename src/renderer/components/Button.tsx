import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button
            className={twMerge(
                `p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:outline focus-visible:outline-white focus-visible:outline-offset-4 disabled:bg-indigo-700`,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
