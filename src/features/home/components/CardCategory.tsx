"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { category } from "../types/category";

interface CategoryCardProps {
    category: category[];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl px-4">
            {category.map((item) => {
                console.log("Navigating to category:", item.name);
                return (
                    <Link
                        key={item.id}
                        href={`/${encodeURIComponent(item.name)}`}
                        className="group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-xl cursor-pointer"
                    >
                        <div className="w-full aspect-square overflow-hidden rounded-3xl mb-4 bg-gray-50">
                            <img
                                src={item.banner}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <h3 className="text-3xl font-black text-[#4b2c20] uppercase tracking-tight font-[Ubuntu]">
                            {item.name}
                        </h3>

                        <span className="mt-1 text-sm font-medium text-gray-400 capitalize">
                            {Math.floor(Math.random() * 10) + 1} items
                        </span>

                        <div className="mt-4 flex items-center justify-center text-gray-400 transition-colors group-hover:text-[#4b2c20]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
