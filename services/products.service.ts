import { ProductResponse } from "@/interface/product.interface";

export const fetchProducts = async (
    query: string,
    page: number,
    limit: number): Promise<ProductResponse> => {
    const skip = (page - 1) * limit;

    console.log("Query form service layer: ", query);
    const url = query ?
        `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}` :
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    const res = await fetch(url, {
        next: {
            revalidate: 10
        }
    })

    const data: ProductResponse = await res.json()
    return {
        products: data.products,
        total: data.total,
        skip: skip,
        limit: limit
    }

}