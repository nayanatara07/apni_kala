import express from "express";
import colors from "colors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";

//configure env
dotenv.config();

//database
connectDB();

//rest object
const app = express();

//middelwares
app.use(express.json())
app.use(morgan('dev'));

//routes
//app.use("/", authRoutes);

//rest api
app.get("/", (req, res) => {
    res.send('<h1>Welcome to Apni Kala App</h1>');
});
app.use("/", authRoutes);
//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`.bgCyan.white);
});