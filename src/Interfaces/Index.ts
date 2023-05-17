import { Request } from "express";

export interface DecodedData {
    id: string;
    name: string;
    emai: string;
    role: string;
  }
  export interface ExtendedRequest extends Request {
    info?: DecodedData;
    params: {
      product_id: string;
      id:string
      email:string 
    };
  }
  
  export type Products = {
    id: string;
    productName: string;
    isDeleted: string;
    inStock: number;
    price: number;
    image: string;
    description: string;
  };
  export interface Cart {
    product_id: string;
    user_id: string;
    count: string;
    isDeleted: number
  }
 export  type Order = {
    id:string,
    user_id: string,
    isCancelled: number,
    status:string

  }
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isDeleted: number;
    password: string;
    emailSent: string;
  }
  
