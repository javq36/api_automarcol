import { Router } from "express";
import { getFotonInv, getFotonRep } from "../controllers";

export const fotonRoute = Router();

fotonRoute.get("/inv", getFotonInv);

fotonRoute.get("/rep", getFotonRep);

/* router.post('/clientsById', getClientsById); */

