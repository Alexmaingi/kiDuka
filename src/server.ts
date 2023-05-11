import express, {json} from 'express'
import userRoute from './Routes/userRoute'
import productRoutes from './Routes/productRoutes'

const app = express()
app.use(json())


app.use('/users', userRoute)
app.use('/products',productRoutes)


app.listen(4000, ()=>{
    console.log("Server Running...")
})
import userRoutes from "./Routes/userRoutes";
import express, { json } from "express";

const app = express();
app.use(json()); // middleware

app.use("/user", userRoutes);

app.listen(5000, () => {
  console.log("Server Running...");
});
