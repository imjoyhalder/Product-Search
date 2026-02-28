import { ProductResponse } from "@/interface/product.interface";

export const fetchProducts = async (
    query: string,
    page: number,
    limit: number = 8
): Promise<ProductResponse> => {
    const skip = (page - 1) * limit;

    const url = query
        ? `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch products");

    const data: ProductResponse = await res.json();

    if (query) {
        const filtered = data.products.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase())
        );

        return {
            products: filtered.slice(skip, skip + limit),
            total: filtered.length,
            skip,
            limit
        };
    }

    return data
};


