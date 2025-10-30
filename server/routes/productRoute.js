import { Router } from "express";
import {
  AddProduct,
  GetPaginatedProducts,
} from "../controllers/productController.js";

const router = Router();

router.get("/", GetPaginatedProducts);
router.post("/", AddProduct);

export default router;
