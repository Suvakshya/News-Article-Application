import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

//------------------ Database connection-------------------------//
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//-----------------creating server--------------------------//
const app = express();

app.use(express.json()); // for allowing json object in req body

app.listen(5000, () => {
  console.log("server is running in port 5000");
});

//-------------------routes-------------------------------//
app.use("/api/auth", authRoutes);

//------------------error middleware---------------------//
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
