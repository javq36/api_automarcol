import { Router } from "express";
import {
  getPeugeotCarter,
  getPeugeotInv,
  getPeugeotRep,
  getPeugeotRepAll,
  getPeugeotVentastaller,
  getPeugeotVta,
} from "../controllers";

export const peugeotRoute = Router();

peugeotRoute.get("/inv", getPeugeotInv);

peugeotRoute.get("/rep", getPeugeotRep);

peugeotRoute.get("/rep/all", getPeugeotRepAll);

peugeotRoute.post("/vta", getPeugeotVta);

peugeotRoute.post("/vtaTall", getPeugeotVentastaller);

peugeotRoute.get("/carter", getPeugeotCarter);
