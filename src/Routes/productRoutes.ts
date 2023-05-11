import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController";
import { verifyToken } from "../middleware/verifyToken";

const productRoutes = Router();

productRoutes.post("", verifyToken, addProduct);
productRoutes.get("", getAllProducts);
productRoutes.get("/:id", getProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
