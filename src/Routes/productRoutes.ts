import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/productController";

const productRoutes = Router()

productRoutes.post('', addProduct)
productRoutes.get('',getAllProducts)
productRoutes.get('/:id',getProduct)
productRoutes.put('/:id',updateProduct)
productRoutes.delete('/:id',deleteProduct)


export default productRoutes