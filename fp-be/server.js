import express from "express";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/AuthRoutes.js";
import cors from "cors";

const app = express();
const port = 8080;


const allowedOrigins = ["http://localhost:5173"];

app.use(cors({origin: allowedOrigins,credentials:true}));


app.use(express.json());

connectDB();

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});