import { fetchProducts } from "@/services/products.service";
import { Suspense } from "react";
import SearchBar from "../_components/serchBox";
import { Card } from "../_components/card";

// টাইপ ডিফাইন করা (Next.js 15 এর জন্য জরুরি)
type SearchParams = Promise<{ query?: string; page?: string }>;

export default async function ProductsPage(props: { searchParams: SearchParams }) {
    // searchParams আনর‍্যাপ করা
    const params = await props.searchParams;
    const query = params.query || "";
    const page = Number(params.page) || 1;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Products</h1>
            <SearchBar />

            <Suspense key={query + page} fallback={<p className="text-blue-500 font-semibold">Loading products server-side...</p>}>
                <ProductList query={query} page={page} />
            </Suspense>
        </div>
    );
}

async function ProductList({ query, page }: { query: string; page: number }) {
    let result = null;
    let errorMessage = "";

    try {
        const limit = 10;
        // ডেটা ফেচিং
        result = await fetchProducts(query, page, limit);
    } catch (error) {
        console.error("Fetch Error:", error);
        errorMessage = "Network error! API server might be down or your connection is slow.";
    }

    if (errorMessage) {
        return <div className="text-red-500 p-4 border border-red-200 rounded-lg">{errorMessage}</div>;
    }

    if (!result || !result.products || result.products.length === 0) {
        return <p className="text-gray-500">No products found for `{query}`.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.products.map((product) => (
                <Card key={product.id} product={product} />
            ))}
        </div>
    );
}