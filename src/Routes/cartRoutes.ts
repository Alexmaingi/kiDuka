import { Router } from "express";
import {
  addToCart,
  deleteCartProduct,
  getAllinCart,
} from "../controllers/cartController";
import { verifyToken } from "../middleware/verifyToken";

const cartRoutes = Router();

cartRoutes.post("/:product_id", verifyToken, addToCart);
cartRoutes.get("/:user_id", getAllinCart);
cartRoutes.put("/:product_id", verifyToken, deleteCartProduct);

export default cartRoutes;
