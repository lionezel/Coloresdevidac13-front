import { Suspense } from "react";
import HomeView from "@/src/features/home/components/home-view";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

export default function Home() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando menú...</div>}>
                <HomeView />
            </Suspense>
        </ProtectedRoute>
    );
}