import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleItemDelete = async (productId) => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/cart/delete/${productId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.status === 403) navigate("/signin");
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setCart(data.data.products);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong! Please try again later."
      );
    }
  };

  const handleItemCountUpdate = async (quantity, productId) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setCart(data.data.products);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong! Please try again later."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-900">
        🛒 Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-600">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Continue Shopping →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((c) => (
            <div
              key={c._id}
              className="flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl p-6"
            >
              {/* Product Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full">
                {c.productId.imageUrl && (
                  <img
                    src={
                      c.productId.imageUrl ||
                      "https://via.placeholder.com/120x120?text=No+Image"
                    }
                    alt={c.productId.title}
                    className="w-28 h-28 object-cover rounded-lg border border-gray-100 mb-4 sm:mb-0"
                  />
                )}
                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    {c.productId.title}
                  </p>
                  <p className="text-gray-600 text-lg">
                    ₹{c.productId.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock available: {c.productId.stock}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {c.quantity === 1 ? (
                  <button
                    onClick={() => handleItemDelete(c.productId._id)}
                    className="text-red-500 hover:text-red-600 text-2xl transition-transform duration-150 hover:scale-110"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleItemCountUpdate(c.quantity - 1, c.productId._id)
                    }
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-xl font-semibold"
                  >
                    -
                  </button>
                )}

                <span className="text-lg font-medium">{c.quantity}</span>

                <button
                  disabled={c.quantity === c.productId.stock}
                  onClick={() =>
                    handleItemCountUpdate(c.quantity + 1, c.productId._id)
                  }
                  className={`px-3 py-1 rounded-md text-xl font-semibold ${
                    c.quantity === c.productId.stock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="ml-4 mt-4 sm:mt-0 text-lg font-semibold text-green-700">
                ₹{(c.productId.price * c.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button
          disabled={cart.length === 0}
          onClick={() => navigate("/checkout")}
          className={`mt-10 px-8 py-3 rounded-lg text-lg font-semibold shadow-md transform transition-all duration-200
    ${
      cart.length === 0
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
    }`}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;
