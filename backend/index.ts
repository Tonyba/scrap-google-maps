import express from "express";
import { PORT } from "./utils/constants";
import dotenv from 'dotenv';

dotenv.config();
const app = express();


app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
  }).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });