import userRoutes from "./Routes/userRoutes";
import express, { json } from "express";

const app = express();
app.use(json()); // middleware

app.use("/user", userRoutes);

app.listen(5000, () => {
  console.log("Server Running...");
});
