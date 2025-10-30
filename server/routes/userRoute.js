import { Router } from "express";
import { Signin, Signup, Logout } from "../controllers/userController.js";

const router = Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/logout", Logout);
export default router;
