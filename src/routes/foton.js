import { Router } from "express";
import { getFotonInv } from "../controllers";

export const fotonRoute = Router();

fotonRoute.get("/inv", getFotonInv);


/* router.post('/clientsById', getClientsById); */

