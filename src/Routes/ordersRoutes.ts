import { Router} from "express";
import { deleteOrder, getAllOrders, getAllOrdersByUserId, makeOrder, updateOrderToDelivered, updateOrderToDispatched } from "../controllers/ordersController";
import { verifyToken } from "../middleware/verifyToken";


const ordersRoutes = Router()

ordersRoutes.post("/:user_id",makeOrder)
ordersRoutes.put("/delete/:id",verifyToken, deleteOrder)
ordersRoutes.put("/delivered/:id",verifyToken, updateOrderToDelivered)
ordersRoutes.put("/dispatched/:id",verifyToken, updateOrderToDispatched)
ordersRoutes.get("",verifyToken, getAllOrders)
ordersRoutes.get("/:user_id", getAllOrdersByUserId)


export default ordersRoutes