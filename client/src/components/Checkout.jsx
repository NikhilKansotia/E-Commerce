import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCheckoutRecipt = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/cart/checkout`, {
        credentials: "include",
      });
      if (response.status === 403) navigate("/signin");
      const data = await response.json();
      if (data.data.cart?.products) {
        console.log(data.data.cart?.products);
        setCart(data.data.cart.products);
        setTotalAmount(data.data.totalAmount);
      }
    } catch (error) {
      console.error("Error in Fetching the Checkout receipt: ", error);
    }
  };

  useEffect(() => {
    fetchCheckoutRecipt();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
        🧾 Checkout Receipt
      </h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-20">
          <p>Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Return to Home →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Product</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Quantity
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">Price</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 flex items-center space-x-4">
                      {item.productId.imageUrl && (
                        <img
                          src={
                            item.productId.imageUrl ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={item.productId.title}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      )}
                      <span className="font-medium text-gray-800">
                        {item.productId.title}
                      </span>
                    </td>
                    <td className="text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="text-center text-gray-700">
                      ₹{item.productId.price.toLocaleString()}
                    </td>
                    <td className="text-center text-green-700 font-semibold">
                      ₹{(item.productId.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-10 border-t pt-6 text-right">
            <p className="text-lg text-gray-700">
              Total Items: <span className="font-semibold">{cart.length}</span>
            </p>
            <p className="text-2xl font-bold text-green-700 mt-2">
              Total Amount: ₹{totalAmount.toLocaleString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
            >
              ← Return to Home
            </button>
            <button
              onClick={() => alert("Purchase Confirmed!")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200"
            >
              Confirm Purchase ✅
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
