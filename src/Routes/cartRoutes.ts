import { Router } from "express";
import {
  addToCart,
  deleteCartProduct,
  getAllinCart,
  incrementToCart,
} from "../controllers/cartController";
import { verifyToken } from "../middleware/verifyToken";

const cartRoutes = Router();

cartRoutes.post("/:product_id", verifyToken, addToCart);
cartRoutes.get("/:user_id", getAllinCart);
cartRoutes.put("/:product_id", verifyToken, deleteCartProduct);
cartRoutes.put("/cart/:product_id", verifyToken, incrementToCart);

export default cartRoutes;
