import { Suspense } from "react";
import { CategoryView } from "@/src/features/category/components/category-view";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "restaurants", RestaurantId, "category"));
        const params = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const slug = data.name.toLowerCase().replace(/\s+/g, '-');
            return { categoryId: slug };
        });
        return params;
    } catch (error) {
        console.error("Error fetching categories for static params:", error);
        return [];
    }
}

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