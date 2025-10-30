import { useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ProductListing } from "../components/ProductListing";
import { CartContext } from "../context/cartContext";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Home() {
  const user = localStorage.getItem("user");
  const { setCart } = useContext(CartContext);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/cart`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 403) localStorage.removeItem("user");
      else {
        const data = await response.json();
        setCart(data.data.products);
      }
    } catch (error) {
      console.error("Error in fetching Cart items: ", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);
  return (
    <div>
      <Navbar />
      <ProductListing />
    </div>
  );
}
