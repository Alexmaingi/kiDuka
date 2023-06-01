import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { sqlConfig } from "../config";
import { v4 as uid } from "uuid";
import bcrypt from "bcrypt";
import { userRegistrationSchema } from "../Helpers/userValidation";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import { ExtendedRequest,User } from "../Interfaces/Index";
import { DatabaseHelper } from "../DatabaseHelper";


dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// inserting users

export const addUser = async (req: ExtendedRequest, res: Response) => {
  try {
    let id = uid();
    const { name, email, password, phoneNumber } = req.body;

    const { error } = userRegistrationSchema.validate(req.body);

    if (error) {
      return res.status(404).json({message:error.message});
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    await DatabaseHelper.exec('insertUser',{id,name,email,password:hashedPassword,phoneNumber})
    return res.status(201).json({ message: "user registered!!" });
  } catch (error: any) {
    return res.status(500).json({message:error.message});
  }
};

// getting all users

export const getallUser = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    let users: User[] =  (await DatabaseHelper.exec("getUsers"))
      .recordset;
    res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// getting users by id

export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);
    let user:User = await (await DatabaseHelper.exec('getUserById', {id})).recordset[0]
    

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


    let user: User[] = (await DatabaseHelper.exec("getUserByEmail",{email})).recordset;
    if(user=[]){
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json(user);
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
    let user: User = await (await DatabaseHelper.exec("getUserById",{id})).recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
   await DatabaseHelper.exec("updateUSer",{id,name,email,password:hashedPassword,phoneNumber});
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
   
    let user: User = (
      await ( await DatabaseHelper.exec("getUserById",{id}))).recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    await DatabaseHelper.exec("deleteUser",{id});
    return res.status(200).json({ message: "User Deleted" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    
    const { email, password } = req.body;
    let user: User[] = (await (await DatabaseHelper.exec("getUserByEmail",{email})
    )).recordset;
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
   const role =user[0].role
    return res.json({ message: "Log in successfull", token, role});
  } catch (error: any) {
    return res.status(404).json({message:error.message});
  }
};


export const forgotPassword = async (req: ExtendedRequest, res: Response) => {
try {
  const {email} = req.params

  
  let user: User[] = (
    await (await DatabaseHelper.exec("getUserByEmail",{email})
  )).recordset;
  console.log(user);
  
  if (!user[0]) {
    return res.status(404).json({ message: "User not found" });
  }

  //const tok = jwt.sign({id:req.info?.id, name:req.info?.name, role:req.info?.role, emai:req.info?.emai}, process.env.SECRET_KEY as string, {expiresIn: '1hr'})

  
  let configOptions={
   
    host: "smtp.gmail.com",
    service:'gmail',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    }
}

//ejs.renderFile('forgotPassword/forgotPWD.ejs', {username:req.info?.name}, async(err,html)=>{


    let msgOps={
        from:process.env.EMAIL,
        to:email,
        subject:"Reset password",
        html: `<html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .logo {
              display: block;
              margin: 0 auto;
              max-width: 200px;
            }
            .reset-message {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 30px;
            }
            .content {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .cta {
              display: inline-block;
              background-color: #ff6600;
              color: #ffffff;
              font-size: 16px;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .cta:hover {
              background-color: #ff5500;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="logo" src="https://example.com/kiduka-logo.png" alt="kiDuka Logo">
            <div class="reset-message">Reset Your Password</div>
            <div class="content">
              <p>Hello  ${user[0].name},</p>
              <p>We received a request to reset your password for your kiDuka account. If you did not make this request, you can safely ignore this email.</p>
              <p>To reset your password, please click the button below:</p>
            </div>
            <a class="cta" href="http://localhost:4000/users/forgotPassword/reset/${user[0].id}">Reset Password</a>
            <div class="content">
              <p>If the button above doesn't work, you can copy and paste the following URL into your web browser:http://localhost:4000/users/forgotPassword/reset/${user[0].id}</p>
              <p></p>
            </div>
            <div class="content">
              <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
              <p>Thank you,</p>
              <p>The kiDuka Team</p>
            </div>
          </div>
        </body>
      </html>
      `
    }
    
    
    let transporter = nodemailer.createTransport(configOptions)
await transporter.sendMail(msgOps)

return res.status(200).json({ message: "Email Sent!" })


//}) 
} catch (error:any) {
  return res.status(404).json(error.message);
}
   

}



export const resetPassword = async (req: ExtendedRequest, res: Response) => {
  try {
    const { password } = req.body;
    const {id} = req.params
    let hashedPassword = await bcrypt.hash(password, 10);
 console.log(id);
 
    let user: User = (
      await (await DatabaseHelper.exec("getUserById",{id})
    )).recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    DatabaseHelper.exec("resetPassword",{id,password:hashedPassword});
    return res.status(200).json({ message: "User Password Updated" });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};