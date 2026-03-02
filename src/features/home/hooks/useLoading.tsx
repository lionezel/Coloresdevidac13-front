import React from "react";

export const useLoading = () => {
    const Loading = () => (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#eb3d06] border-t-transparent"></div>
        </div>
    );

    return { Loading };
};
