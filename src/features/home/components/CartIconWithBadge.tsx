import React from "react";

interface CartIconWithBadgeProps {
    onPress: () => void;
}

export const CartIconWithBadge: React.FC<CartIconWithBadgeProps> = ({ onPress }) => {
    return (
        <button
            onClick={onPress}
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100/50 text-[#4b2c20] transition-all hover:bg-gray-200"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4b2c20] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                1
            </span>
        </button>
    );
};
