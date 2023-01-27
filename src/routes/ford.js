import { Router } from "express";
import { getFordInv, getFordrep } from "../controllers";

export const fordRoute = Router();

fordRoute.get("/inv", getFordInv);

fordRoute.get("/rep", getFordrep);

/* router.post('/clientsById', getClientsById); */

