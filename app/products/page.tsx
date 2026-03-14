// app/products/page.tsx
import { fetchProducts } from "@/services/products.service";

import { Suspense } from "react";
import SearchBar from "../_components/serchBox";
import { Product } from "@/interface/product.interface";
import { Card } from "../_components/card";


// Server Component
export default async function ProductsPage({searchParams,}: {searchParams?: { query?: string; page?: string };}) {
    // URL থেকে query নিচ্ছি। না থাকলে ডিফল্ট ফাঁকা স্ট্রিং।
    const query = searchParams?.query || "";
    const page = Number(searchParams?.page) || 1;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Products</h1>

            {/* সার্চবার রেন্ডার করলাম */}
            <SearchBar />

            {/* Suspense: সার্ভার থেকে ডেটা ফেচ হতে যতক্ষণ সময় লাগবে, 
              ততক্ষণ fallback-এর ভেতরের UI দেখাবে।
              key প্রপার্টি দেওয়া জরুরি, যাতে query চেঞ্জ হলে Suspense আবার ট্রিগার হয়। 
            */}
            <Suspense key={query + page} fallback={<p className="text-blue-500">Loading products server-side...</p>}>
                <ProductList query={query} page={page} />
            </Suspense>
        </div>
    );
}

// ডেটা ফেচ করার জন্য আলাদা একটি Async কম্পোনেন্ট
async function ProductList({ query, page }: { query: string; page: number }) {
    let result = null;
    let errorMessage = "";

    // ১. শুধুমাত্র ডেটা ফেচিং টুকু try/catch এ থাকবে
    try {
        const limit = 10;
        console.log("Query from Product page Query: ", query);
        result = await fetchProducts(query, page, limit);
    } catch (error) {
        errorMessage = "Failed to fetch products. Please try again later.";
    }

    // ২. এরর থাকলে তার জন্য আলাদা রিটার্ন
    if (errorMessage) {
        return <div className="text-red-500 p-4 border border-red-200">{errorMessage}</div>;
    }

    // ৩. ডেটা না পাওয়া গেলে (Not Found) তার জন্য রিটার্ন
    if (!result || result.products.length === 0) {
        return <p className="text-gray-500">No products found for `{query}`.</p>;
    }

    // ৪. সবশেষে ক্লিন সাকসেস UI রিটার্ন
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.products.map((product) => (
                <Card key={product.id} product={product}></Card>
            ))}
        </div>
    );
}