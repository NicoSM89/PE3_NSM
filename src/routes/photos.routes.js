import { Router } from "express";
import { getPhotos, postPhotos } from "../controllers/photos.controller.js";

const photosRoutes = Router();

photosRoutes.get('/', getPhotos);

photosRoutes.post('/', postPhotos);

export default photosRoutes;