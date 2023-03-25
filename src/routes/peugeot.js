import { Router } from "express";
import { getPeugeotCarter, getPeugeotInv, getPeugeotRep, getPeugeotRepAll, getPeugeotVta } from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);

peugeotRoute.get("/rep", getPeugeotRep);

peugeotRoute.get("/rep/all", getPeugeotRepAll);

peugeotRoute.get("/vta", getPeugeotVta);

peugeotRoute.get("/carter", getPeugeotCarter);
