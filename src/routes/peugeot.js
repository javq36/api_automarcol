import { Router } from "express";
import { getPeugeotInv } from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);


/* router.post('/clientsById', getClientsById); */

