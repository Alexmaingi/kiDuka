import { Request, Response } from "express";
import { v4 as uid } from "uuid";
import mssql from "mssql";
import { sqlConfig } from "../config";

interface DecodedData {
    id: string;
    name: string;
    emai: string;
    role: string;
  }
interface ExtendedRequest extends Request {
    body:{
        user_id: string;
    }
    info?: DecodedData;
    params: {
      id: string;
    };
  }

  type Order = {
    id:string,
    user_id: string,
    isCancelled: number,
    status:string

  }

export const makeOrder =async (req:Request<{ user_id: String }>, res:Response) => {
    
try {
    let id=uid()
    const {user_id} = req.params

    const pool = await mssql.connect(sqlConfig);

    await pool
    .request()
    .input("id",id)
    .input("user_id",user_id)
    .execute("makeOrder")
    return res.status(200).json({ message: "Order Placed" });


} catch (error:any) {
 return res.status(500).json(error.message)
    
}

}

export const deleteOrder = async (req: ExtendedRequest, res: Response) => {
    try {
      const pool = await mssql.connect(sqlConfig);
      const { id } = req.params;
  
      let order: Order[] = (
        await pool.request().input("id", id).execute("getOrderById")
      ).recordset;
  
      if (!order.length) {
        return res.status(404).json({ message: "Order Not Found" });
      }
         //question, how do I confirm user_id before this point and send an error message-------------------------------------
        await pool.request().input("id", id).input("user_id",req.info?.id ).execute("deleteOrder");
        return res.status(200).json({ message: "order deleted successfully" });
             
      
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
  
  export const updateOrderToDelivered = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params;
  
      const pool = await mssql.connect(sqlConfig);
      if (req.info?.role === "admin") {
        await pool
          .request()
          .input("id", mssql.VarChar, id)
          .execute("updateOrderStatusToDelivered");
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
  
      const pool = await mssql.connect(sqlConfig);
      if (req.info?.role === "admin") {
        await pool
          .request()
          .input("id", mssql.VarChar, id)
          .execute("updateOrderStatusToDispatched");
        return res.status(201).json({ message: "order dispatched!" });
      }
      return res.status(500).json({ message: "Unauthorized" });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };


  export const getAllOrders = async (req: ExtendedRequest, res: Response) => {
    try {
      const pool = await mssql.connect(sqlConfig);
      if (req.info?.role === "admin") {
      let orders: Order[] = (await pool.request().execute("getAllOrders"))
        .recordset;
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
      const pool = await mssql.connect(sqlConfig);
          
      
      let orders: Order[] = (await pool.request().input("id",id).input("user_id",req.info?.id).execute("getAllOrdersByUserId"))
        .recordset;
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };