import { Router } from "express";
import { updateImgModel } from "../controllers";

export const imageRoute = Router();

imageRoute.put("/vehicles/model", updateImgModel);


/* router.post('/clientsById', getClientsById); */

