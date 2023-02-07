import { Router } from "express";
import { getPeugeotInv, getPeugeotRep, getPeugeotVta } from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);

peugeotRoute.get("/rep", getPeugeotRep);

peugeotRoute.post("/vta", getPeugeotVta);



