import { Router } from "express";
import { getPlacePhoto, getPlaces } from "../controllers/map_scrapper";

const router = Router();

router.get('/', getPlaces);
router.get('/get-place-photo', getPlacePhoto)

export default router;