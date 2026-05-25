import express, { json } from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/userRoutes.js"


dotenv.config();

const app = express();


//middlewares
app.use(json())
app.use(cookieParser())

//route
app.use("/api",userRouter)

const port = process.env.PORT || 5001

app.listen(port,()=>{
    connectDb();
    console.log("server is running at : ",port)
})