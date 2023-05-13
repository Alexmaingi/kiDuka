import express, { json } from "express";
import userRoutes from "./Routes/userRoutes";
import productRoutes from "./Routes/productRoutes";

const app = express();
app.use(json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(9000, () => {
  console.log("Server Running...");
});
