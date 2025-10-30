import React from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, message, heading }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center transform transition-all scale-100 hover:scale-[1.02] duration-200">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          {heading || "User Signin required"}
        </h2>
        <p className="text-gray-600 mb-6">
          {message || "Please sign in to continue."}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="cursor-pointer bg-linear-to-r from-blue-600 to-purple-700 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer border border-gray-400 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
