import { Router } from "express";
import { getFotonCarter, getFotonInv, getFotonRep, getFotonRepAll, getFotonVentastaller, getFotonVta } from "../controllers";

export const fotonRoute = Router();

fotonRoute.get("/inv", getFotonInv);

fotonRoute.get("/rep", getFotonRep);

fotonRoute.get("/rep/all", getFotonRepAll);

fotonRoute.post("/vta", getFotonVta);

fotonRoute.post("/vtaTall", getFotonVentastaller);

fotonRoute.get("/carter", getFotonCarter);