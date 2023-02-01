import { Router } from "express";
import { getPeugeotInv, getPeugeotRep } from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);

peugeotRoute.get("/rep", getPeugeotRep);

/* router.post('/clientsById', getClientsById); */

