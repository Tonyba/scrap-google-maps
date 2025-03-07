import { Router } from "express";
import { getPlaces } from "../controllers/map_scrapper";

const router = Router();

router.get('/', getPlaces);


export default router;