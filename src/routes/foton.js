import { Router } from "express";
import { getFotonCarter, getFotonInv, getFotonRep, getFotonRepAll, getFotonVta } from "../controllers";

export const fotonRoute = Router();

fotonRoute.get("/inv", getFotonInv);

fotonRoute.get("/rep", getFotonRep);

fotonRoute.get("/rep/all", getFotonRepAll);

fotonRoute.get("/vta", getFotonVta);

fotonRoute.get("/carter", getFotonCarter);