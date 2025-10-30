import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Product from "./Product";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const PAGE_LIMIT = 10;

export const ProductListing = () => {
  //* states
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${BACKEND_BASE_URL}/products?limit=${PAGE_LIMIT}&skip=${
          (pageNumber - 1) * PAGE_LIMIT
        }`
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setProducts(data.data.products);
      setTotalPages(Math.ceil(data.data.totalProducts / PAGE_LIMIT));
    } catch (error) {
      console.error("Error in fetching products: ", error);
      toast.error(error.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-lg text-gray-600 font-semibold">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Product List
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg font-medium">
            No products found.
          </p>
        ) : (
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        )}
      </div>
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            pageNumber === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-semibold">
          Page {pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber === totalPages}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            pageNumber === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
