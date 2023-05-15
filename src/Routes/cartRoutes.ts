import { Router } from "express";
import {
  addToCart,
  decrementCount,
  deleteCartProduct,
  getAllinCart,
  incrementCount,
} from "../controllers/cartController";
import { verifyToken } from "../middleware/verifyToken";

const cartRoutes = Router();

cartRoutes.post("/:product_id", verifyToken, addToCart);
cartRoutes.get("/:user_id", getAllinCart);
cartRoutes.put("/:product_id", verifyToken, deleteCartProduct);
cartRoutes.put("/decrement/:product_id",verifyToken, decrementCount)
cartRoutes.put("/increment/:product_id",verifyToken, incrementCount)


export default cartRoutes;
