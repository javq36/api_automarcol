import { Router } from "express";
import { getFordInv } from "../controllers";

export const fordRoute = Router();

fordRoute.get("/inv", getFordInv);


/* router.post('/clientsById', getClientsById); */

