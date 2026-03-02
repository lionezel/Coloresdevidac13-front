import { Suspense } from "react";
import { CategoryView } from "@/src/features/category/components/category-view";

interface Props {
    params: Promise<{ categoryId: string }>
}

export default async function CategoryPage({ params }: Props) {
    const { categoryId } = await params;

    return (
        <Suspense
            fallback={
                <div className="p-8 text-center text-muted-foreground">
                    Cargando productos...
                </div>
            }
        >
            <CategoryView slug={categoryId} />
        </Suspense>
    );
}