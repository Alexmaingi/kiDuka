import { Router } from "express";
import {
  addUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getallUser,
  updateUser,
} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("", addUser);
userRoutes.get("", getallUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("", getUserByEmail);
userRoutes.put("", updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
