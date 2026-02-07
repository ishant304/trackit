import express from 'express'
import connectDB from './config/db.js';
import cors from 'cors'
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import statsRoutes from "./routes/statsRoutes.js"

dotenv.config()

connectDB();

const app = express()

app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,resp)=>{
    resp.send("hello world")
})

app.use("/api/user", userRoutes)

app.use("/api/expense", expenseRoutes)

app.use("/api/stats" , statsRoutes)

app.listen(process.env.PORT,()=>{
    console.log("The server has started")
})