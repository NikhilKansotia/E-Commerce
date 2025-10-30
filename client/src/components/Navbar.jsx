import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthModal from "./AuthModal";
import { CartContext } from "../context/cartContext";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const { cart } = useContext(CartContext);

  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      localStorage.removeItem("user");
      toast.success("User logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Error in logging out: ", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleViewCart = () => {
    if (user) navigate("/cart");
    else setModalOpen(true);
  };

  return (
    <nav className="bg-linear-to-r from-blue-100 via-indigo-300 to-blue-100 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight select-none">
              E-Shop
            </span>
          </div>
          {/* Navigation Links */}
          <div className="flex space-x-4">
            <div className="relative">
              <button
                className="cursor-pointer font-semibold text-gray-800 px-3 py-1 rounded transition-colors duration-200 hover:text-blue-700 hover:bg-blue-50 hover:underline underline-offset-4 text-2xl"
                onClick={handleViewCart}
              >
                🛒
              </button>
              {user && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  {cart.length}
                </span>
              )}
            </div>

            {!user ? (
              <Link
                to="/signin"
                className="cursor-pointer font-semibold text-gray-800 px-3 py-1 rounded transition-colors duration-200 hover:text-blue-700 hover:bg-blue-50 hover:underline underline-offset-4"
              >
                Signin
              </Link>
            ) : (
              <button
                className="cursor-pointer font-semibold text-gray-800 px-3 py-1 rounded transition-colors duration-200 hover:text-blue-700 hover:bg-blue-50 hover:underline underline-offset-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message="Please sign in to view your cart items."
      />
    </nav>
  );
};
