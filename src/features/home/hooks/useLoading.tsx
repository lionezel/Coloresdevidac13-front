import { ColorGlobal } from "@/src/global/colorGlobal";

export const useLoading = () => {
    const Loading = () => (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                style={{ borderColor: ColorGlobal, borderTopColor: 'transparent' }}
            ></div>
        </div>
    );

    return { Loading };
};
