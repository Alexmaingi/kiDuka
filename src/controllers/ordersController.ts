import { Request, Response } from "express";
import { v4 as uid } from "uuid";
import mssql from "mssql";
import { sqlConfig } from "../config";
import { ExtendedRequest,Order, Cart } from "../Interfaces/Index";
import { DatabaseHelper } from "../DatabaseHelper";

export const makeOrder =async (req:Request<{ user_id: string }>, res:Response) => {
    
try {
    let id=uid()
    const {user_id} = req.params

    let cart: Cart[] = ( await
      DatabaseHelper.query(`SELECT * FROM cart WHERE isDeleted = 0 and user_id = '${user_id}'`)
    ).recordset;

    if(!cart.length){
      return res.status(404).json({ message: "No Items in Cart" });
    }
    await DatabaseHelper.exec("makeOrder",{id, user_id})
    return res.status(200).json({ message: "Order Placed" });


} catch (error:any) {
 return res.status(500).json(error.message)
    
}

}

export const deleteOrder = async (req: ExtendedRequest, res: Response) => {
    try {
  
      const { id } = req.params;
  
      let order: Order[] = (
        await DatabaseHelper.exec("getOrderById",{id})
      ).recordset;
  
      if (!order.length || order[0].user_id != req.info?.id) {
        return res.status(404).json({ message: "Order Not Found" });
      }
         //question, how do I confirm user_id before this point and send an error message-------------------------------------
         await DatabaseHelper.exec("deleteOrder",{id,user_id:req.info.id});

         //await pool.request().input("id", id).input("user_id",req.info?.id ).execute("deleteOrder");
        return res.status(200).json({ message: "order deleted successfully" });
             
      
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
  
  export const updateOrderToDelivered = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params;
  
      
      if (req.info?.role === "admin") {
        let order: Order[] = (
          await DatabaseHelper.exec("getOrderById",{id})
        ).recordset;
        
        if(!order.length || order[0].isCancelled===1 ){
          return res.status(500).json({ message: "Order does not exist" });
        }
      
        DatabaseHelper.exec("updateOrderStatusToDelivered",{id});
        return res.status(201).json({ message: "order delivered!" });
      }
      return res.status(500).json({ message: "Unauthorized" });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  export const updateOrderToDispatched = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params;
  
    
      if (req.info?.role === "admin") {
        let order: Order[] = (
          await DatabaseHelper.exec("getOrderById",{id})
        ).recordset;
        console.log(order);
        
        if(!order.length || order[0].isCancelled===1 ){
          return res.status(500).json({ message: "Order does not exist" });
        }
        await DatabaseHelper.exec("updateOrderStatusToDispatched",{id});
        return res.status(201).json({ message: "order dispatched!" });
      }
      return res.status(500).json({ message: "Unauthorized" });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };


  export const getAllOrders = async (req: ExtendedRequest, res: Response) => {
    try {
      if (req.info?.role === "admin") {
      let orders: Order[] = (await DatabaseHelper.exec("getAllOrders"))
        .recordset;
        if(!orders.length ){
          return res.status(404).json({ message: "No Orders" });
        }
      return res.status(200).json(orders);
      }
      return res.status(500).json({ message: "Unauthorized" });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  export const getAllOrdersByUserId = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user_id= req.info?.id as string
        console.log(user_id);
        console.log(id);
        
        
      let orders: Order[] = (await DatabaseHelper.exec("getAllOrdersByUserId",{id,user_id}))
        .recordset;

      if(!orders.length ){
        return res.status(404).json({ message: "No Orders" });
      }
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };