import { Router } from "express";
import { getPeugeotInv, getPeugeotRep, getPeugeotRepAll, getPeugeotVta } from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);

peugeotRoute.get("/rep", getPeugeotRep);

peugeotRoute.get("/rep/all", getPeugeotRepAll);

peugeotRoute.post("/vta", getPeugeotVta);



