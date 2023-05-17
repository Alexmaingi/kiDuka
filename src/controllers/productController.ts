import { Request, Response } from "express";
import { v4 as uid } from "uuid";
import mssql from "mssql";
import { sqlConfig } from "../config";
import { loginUser } from "./userController";
import { ExtendedRequest,Products} from "../Interfaces/Index";

export const addProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = uid();
    const { productName, inStock, price, image, description } = req.body;

    const pool = await mssql.connect(sqlConfig);

    if (req.info?.role === "admin") {
      await pool
        .request()
        .input("id", mssql.VarChar, id)
        .input("productName", mssql.VarChar, productName)
        .input("inStock", mssql.Int, inStock)
        .input("price", mssql.Int, price)
        .input("image", mssql.VarChar, image)
        .input("description", mssql.VarChar, description)
        .execute("insertProduct ");
      return res.status(201).json({ message: "product added!" });
    }
    return res.status(500).json({ message: "Unauthorized" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    let products: Products[] = (await pool.request().execute("getProducts"))
      .recordset;
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { id } = req.params;

    let product: Products[] = (
      await pool.request().input("id", id).execute("getProduct")
    ).recordset;

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    } else {
      return res.status(200).json(product);
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const updateProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { id } = req.params;

    let product: Products[] = (
      await pool.request().input("id", id).execute("getProduct")
    ).recordset;

    if (!product.length) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const { productName, inStock, price, image, description } = req.body;
    if (req.info?.role === "admin") {
      await pool
        .request()
        .input("id", id)
        .input("productName", productName)
        .input("inStock", inStock)
        .input("price", price)
        .input("image", image)
        .input("description", description)
        .execute("updateProduct");
      return res.status(200).json({ message: "Product Updated" });
    }
    return res.status(500).json({ message: "Unauthorized" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const deleteProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { id } = req.params;

    let product: Products[] = (
      await pool.request().input("id", id).execute("getProduct")
    ).recordset;

    if (!product.length) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    if (req.info?.role === "admin") {
      await pool.request().input("id", id).execute("deleteProduct");
      return res.status(200).json({ message: "product deleted successfully" });
    }
    return res.status(500).json({ message: "Unauthorized" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};
