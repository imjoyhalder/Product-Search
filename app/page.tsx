import ProductSearch from "./_components/ProductSearch";


const ProductsPage = async () => {
  return (
    <div className="max-w-6xl mx-auto px-4  ">
      <h1 className="text-3xl text-center mt-10 font-bold">
        Product List
      </h1>
      <ProductSearch />
    </div>
  );
};

export default ProductsPage;