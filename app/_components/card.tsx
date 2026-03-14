import { Product } from "@/interface/product.interface";
import Link from "next/link";

// props-কে অবশ্যই destructure করতে হবে: { product }
export const Card = ({ product }: { product: Product }) => { 
    return (
        <div className="border p-4 rounded shadow hover:bg-gray-50 transition">
            <Link href={`/products/${product.id}`}>
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-gray-600">${product.price}</p>
            </Link>
        </div>
    );
};