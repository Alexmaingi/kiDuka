import express, { json } from "express";
import userRoutes from "./Routes/userRoutes";
import productRoutes from "./Routes/productRoutes";
import ordersRoutes from "./Routes/ordersRoutes";

const app = express();
app.use(json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/order",ordersRoutes)

app.listen(4000, () => {
  console.log("Server Running...");
});
