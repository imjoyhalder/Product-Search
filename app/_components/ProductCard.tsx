import { Product } from "@/interface/product.interface";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">


            <div className="relative aspect-square w-full bg-gray-50">
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">

                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600">
                    {product.title}
                </h3>


                <div className="mt-auto">
                    <p className="text-lg font-bold text-gray-900">
                        ${product.price}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;