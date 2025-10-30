import { Router } from "express";
import {
  AddToCart,
  Checkout,
  DeleteCartItem,
  GetCartItems,
  UpdateCartItem,
} from "../controllers/cartController.js";

const router = Router();

router.post("/", AddToCart);
router.get("/", GetCartItems);
router.put("/update", UpdateCartItem);
router.delete("/delete/:productId", DeleteCartItem);
router.get("/checkout", Checkout);

export default router;
