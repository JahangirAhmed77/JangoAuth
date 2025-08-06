import express from "express";
import cors from 'cors';
import 'dotenv/config' ;
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/authroutes.js';

const app = express();

const port = process.env.port || 4000

// DataBase
import ConnectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
ConnectDB();

// Middlewears
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));

// Api EndPoints
app.get('/',(req,res)=>{
    res.send("api working")
})

app.use('/api/auth',authRouter)
app.use('/api/user', userRouter);

app.listen(port,()=>{
    console.log(`server started on ${port}`);
    
})
