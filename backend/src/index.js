import dotenv from "dotenv"
dotenv.config()

import express from 'express'
import connectDB from './config/db.js';
import cors from 'cors'
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import statsRoutes from "./routes/statsRoutes.js"
import geminiRoutes from "./routes/geminiRoutes.js"


connectDB();

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "/api"
  ],
  credentials: true
}));


app.use(express.json())
app.use(cookieParser())

app.get("/",(req,resp)=>{
    resp.send("Backend is running")
})

app.use("/api/user", userRoutes)

app.use("/api/expense", expenseRoutes)

app.use("/api/stats" , statsRoutes)

app.use("/api/gemini", geminiRoutes)



app.listen(process.env.PORT,()=>{
    console.log("The server has started")
})