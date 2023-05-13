import { Request, Response } from "express";
import { sqlConfig } from "../config";
import mssql from "mssql";
import { v4 as uid } from "uuid";

interface DecodedData {
  id: string;
  name: string;
  emai: string;
  role: string;
}
interface ExtendedRequest extends Request {
  info?: DecodedData;
  params: {
    product_id: string;
  };
}

type Products = {
  id: string;
  productName: string;
  isDeleted: string;
  inStock: number;
  price: number;
  image: string;
  description: string;
};
interface Cart {
  product_id: string;
  user_id: string;
}

export const addToCart = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = uid();
    const pool = await mssql.connect(sqlConfig);
    const { product_id } = req.params;

    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("product_id", mssql.VarChar, product_id)
      .input("user_id", mssql.VarChar, req.info?.id)
      .execute("insertProductToCart ");
    return res.status(201).json({ message: "product added!" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const getAllinCart = async (
  req: Request<{ user_id: string }>,
  res: Response
) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { user_id } = req.params;
    let products: Cart[] = (
      await pool.request().input("user_id", user_id).execute("getAllInCart")
    ).recordset;

    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const deleteCartProduct = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { product_id } = req.params;

    let product: Cart[] = (
      await pool
        .request()
        .input("user_id", req.info?.id)
        .execute("getAllInCart")
    ).recordset;
    // console.log(req.info?.id);

    //console.log(product);

    if (!product.length) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    await pool
      .request()
      .input("product_id", product_id)
      .input("user_id", req.info?.id)
      .execute("deleteToCart");
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};
