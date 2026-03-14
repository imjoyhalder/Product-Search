// components/SearchBar.tsx
"use client"; // যেহেতু ইউজারের ইনপুট নেব, তাই এটি Client Component

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchBar() {
    const searchParams = useSearchParams(); // বর্তমান URL এর প্যারামিটার পড়তে
    const pathname = usePathname(); // বর্তমান পাথ (যেমন: /products) পেতে
    const { replace } = useRouter(); // URL আপডেট করতে

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        console.log("SearchParams: ", searchParams);
        console.log("Pathname: ", pathname);
        console.log("Params: ", params);

        console.log(term);

        if (term) {
            params.set('query', term); // ইনপুট থাকলে URL-এ ?query=term বসাবে
        } else {
            params.delete('query'); // ইনপুট ফাঁকা হলে query মুছে দেবে
        }
        
        // পেজ রিলোড না করেই URL আপডেট করে দেবে
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()} // পেজ রিলোড হলেও আগের সার্চ টেক্সট ধরে রাখবে
                className="border p-2 rounded w-full max-w-md"
            />
        </div>
    );
}