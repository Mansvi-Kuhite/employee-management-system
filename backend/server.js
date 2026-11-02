import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});