import { Router } from "express";
import {
  addUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getallUser,
  loginUser,
  updateUser,
} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("", addUser);
userRoutes.get("", getallUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("/email/:email", getUserByEmail);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.post("/login", loginUser);

export default userRoutes;
