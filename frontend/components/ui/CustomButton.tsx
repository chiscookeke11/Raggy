
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
}

const Button = ({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative isolate overflow-hidden
        border border-[#171717]
        px-6 py-2 bg-white
        group cursor-pointer
        transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {/* Animated background */}
            <span
                className="
          absolute inset-0
          bg-black
          scale-y-0 origin-bottom
          group-hover:scale-y-100
          transition-transform duration-300 ease-in-out
          -z-10
        "
            />

            {/* Button text */}
            <span className="relative z-10 text-white
             mix-blend-difference
                 transition-transform duration-300 ease-in-out
             ">
                {children}
            </span>
        </button>
    );
};

export default Button;
