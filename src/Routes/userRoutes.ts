import { Router } from "express";
import {
  addUser,
  deleteUser,
  forgotPassword,
  getUserByEmail,
  getUserById,
  getallUser,
  loginUser,
  resetPassword,
  updateUser,
} from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const userRoutes = Router();

userRoutes.post("", addUser);
userRoutes.get("", getallUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("/email/:email", getUserByEmail);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/forgotPassword/:email", forgotPassword)
userRoutes.put("/forgotPassword/reset/:id", resetPassword)
export default userRoutes;
