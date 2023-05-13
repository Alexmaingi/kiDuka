import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { sqlConfig } from "../config";
import { v4 as uid } from "uuid";
import bcrypt from "bcrypt";
import { userRegistrationSchema } from "../Helpers/userValidation";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface ExtendedRequest extends Request {
  body: {
    name: string;
    email: String;
    password: string;
    phoneNumber: number;
  };
  params: {
    id: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isDeleted: number;
  password: string;
  emailSent: string;
}

// inserting users

export const addUser = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = uid();
    const { name, email, password, phoneNumber } = req.body;

    const { error } = userRegistrationSchema.validate(req.body);

    if (error) {
      return res.status(404).json(error);
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    const pool = await mssql.connect(sqlConfig);
    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("name", mssql.VarChar, name)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedPassword)
      .input("phoneNumber", mssql.VarChar, phoneNumber)
      .execute("insertUser");
    return res.status(201).json({ message: "user registered!!" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// getting all users

export const getallUser = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    let users: User[] = (await (await pool.request()).execute("getUsers"))
      .recordset;
    res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// getting users by id

export const getUserById: RequestHandler<{ id: String }> = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);

    let user: User = (
      await (await pool.request()).input("id", id).execute("getUserById")
    ).recordset[0];

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: "User Not Found" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// getting user by email

export const getUserByEmail: RequestHandler<{ email: string }> = async (
  req,
  res
) => {
  try {
    const { email } = req.params;

    const pool = await mssql.connect(sqlConfig);

    let user: User[] = (
      await (await pool.request())
        .input("email", email)
        .execute("getUserByEmail")
    ).recordset;
    res.json(user);
    // if (user) {
    //   return res.status(200).json(user);
    // }
    // return res.status(404).json({ message: "User Not Found" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// update users

export const updateUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);
    let user: User = (
      await (await pool.request()).input("id", id).execute("getUserById")
    ).recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await pool
      .request()
      .input("id", id)
      .input("name", name)
      .input("email", email)
      .input("password", hashedPassword)
      .input("phoneNumber", phoneNumber)
      .execute("updateUSer");
    return res.status(200).json({ message: "User Updated" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// delete users

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);
    let user: User = (
      await (await pool.request()).input("id", id).execute("getUserById")
    ).recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await pool.request().input("id", id).execute("deleteUser");
    return res.status(200).json({ message: "User Deleted" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { email, password } = req.body;
    let user: User[] = (
      await (await pool.request())
        .input("email", email)
        .execute("getUserByEmail")
    ).recordset;
    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    let valiUser = await bcrypt.compare(password, user[0].password);
    if (!valiUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload = user.map((user1) => {
      const { password, isDeleted, emailSent, ...rest } = user1;
      return rest;
    });

    const token = jwt.sign(payload[0], process.env.SECRET_KEY as string, {
      expiresIn: "360000s",
    });

    return res.json({ message: "Log in successfull", token });
  } catch (error: any) {
    return res.status(404).json(error.message);
  }
};
