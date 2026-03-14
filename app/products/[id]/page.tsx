// আপনার সার্ভিস ফাইল থেকে ডাটা ফেচিং
import { fetchProductById } from "@/services/product.service";
import { notFound } from "next/navigation";

// Next.js 16 টাইপস: params একটি Promise
type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
    // ১. params কে await করে আইডি বের করা
    const { id } = await params;

    // ২. আইডি দিয়ে সার্ভার থেকে ডাটা আনা
    const product = await fetchProductById(id);

    // ৩. প্রোডাক্ট না পাওয়া গেলে 404 পেজ দেখানো
    if (!product) {
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <img src={product.thumbnail} alt={product.title} className="my-4 rounded-lg" />
            <p className="text-2xl font-semibold text-blue-600">${product.price}</p>
            <p className="mt-4 text-gray-700">{product.description}</p>
        </div>
    );
}