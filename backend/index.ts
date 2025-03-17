import express from "express";
import { PORT } from "./utils/constants";
import dotenv from 'dotenv';
import cors from "cors";

import scrapMapRoutes from './routes/scrap-map';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/scrap-map', scrapMapRoutes);

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});