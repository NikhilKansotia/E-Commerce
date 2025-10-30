import { useContext, useState } from "react";
import AuthModal from "./AuthModal";
import { toast } from "react-toastify";
import { CartContext } from "../context/cartContext";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Product = ({ product }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const user = localStorage.getItem("user");
  const { cart, setCart } = useContext(CartContext);

  const addToCartAPI = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setCart(data.data.products);
      toast.success(data.message);
    } catch (error) {
      console.error("Error in addding to cart: ", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleAddToCart = () => {
    if (!user) setModalOpen(true);
    else addToCartAPI();
  };
  return (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-5 flex flex-col items-center"
    >
      <div className="w-full flex-1 flex flex-col items-center justify-between">
        <p className="text-lg font-semibold text-gray-700 mb-2 text-center">
          {product.title}
        </p>
        <p className="text-blue-600 font-bold text-xl mb-1">₹{product.price}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      </div>
      {cart?.find((el) => el.productId._id === product._id) ? (
        <button
          disabled
          className="bg-green-500 text-white rounded-lg px-6 py-2 font-bold cursor-not-allowed"
        >
          Added to Cart <br />
          View Cart to update it
        </button>
      ) : (
        <button
          className="cursor-pointer bg-linear-to-r from-blue-500 to-blue-700 text-white rounded-lg px-6 py-2 font-bold transform transition duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-800"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      )}
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message="Please sign in to add items to cart."
      />
    </div>
  );
};

export default Product;
