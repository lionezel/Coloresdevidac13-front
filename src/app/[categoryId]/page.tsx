import { Suspense } from "react";
import { CategoryView } from "@/src/features/category/components/category-view";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

interface Props {
    params: Promise<{ categoryId: string }>
}

export default async function CategoryPage({ params }: Props) {
    const { categoryId } = await params;

    return (
        <ProtectedRoute>
            <Suspense
                fallback={
                    <div className="p-8 text-center text-muted-foreground">
                        Cargando productos...
                    </div>
                }
            >
                <CategoryView slug={categoryId} />
            </Suspense>
        </ProtectedRoute>
    );
}