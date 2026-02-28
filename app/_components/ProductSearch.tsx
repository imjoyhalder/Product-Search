"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/interface/product.interface";
import { fetchProducts } from "@/services/product.service";
import ProductCard from "./ProductCard";
import Loading from "./loading";

const LIMIT = 20;

const ProductSearch = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const loadData = async (searchQuery: string, currentPage: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchProducts(searchQuery, currentPage, LIMIT);
            setProducts(result.products);
            setTotal(result.total);

            if (searchQuery.trim()) {
                setSuggestions(result.products.slice(0, 6));
            } else {
                setSuggestions([]);
            }
        } catch (err) {
            setError("Failed to load products. Check your connection.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const debounce = setTimeout(() => {
            setPage(1);
            loadData(query, 1);
        }, 400);
        return () => clearTimeout(debounce);
    }, [query]);


    useEffect(() => {
        if (page > 1 || (page === 1 && query === "")) {
            loadData(query, page);
        }
    }, [page]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">

            <div className="relative max-w-xl mx-auto mb-12" ref={wrapperRef}>
                <div className="flex text-black items-center bg-white border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-400 shadow-sm transition-all">
                    <input
                        type="text"
                        value={query}
                        onFocus={() => setIsOpen(true)} 
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder="Search products by name"
                        className="w-full px-5 py-3 outline-none"
                    />
                    <div className="bg-orange-400 p-3 text-white cursor-default">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>


                {isOpen && suggestions.length > 0 && (
                    <div className="absolute w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 z-50 overflow-hidden">
                        {suggestions.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setQuery(item.title);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b last:border-none transition-colors"
                            >
                                <span className="text-sm text-slate-700 font-medium truncate">{item.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loading />
                </div>
            )}


            {error && !loading && (
                <div className="text-center text-red-500 py-10 font-semibold italic">
                    <p>{error}</p>
                </div>
            )}


            {!loading && products.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-gray-500 mb-6 text-lg">
                        No product found for <span className="font-bold text-gray-800 underline">`{query}`</span>
                    </p>
                    <button
                        onClick={() => setQuery('')}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md"
                    >
                        Clear search
                    </button>
                </div>
            )}


            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-300 ${loading ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>


            {products.length > 0 && totalPages > 1 && (
                <div className="mt-20 flex flex-col items-center gap-6">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(1)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            First
                        </button>

                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>

                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 text-sm font-medium rounded-lg border transition-all ${page === i + 1
                                        ? "bg-orange-500 border-orange-500 text-white shadow-md"
                                        : "hover:bg-slate-50 text-slate-600 bg-white"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
                        </div>

                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>

                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage(totalPages)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;