import { Router } from "express";
import { getFotonInv, getFotonRep, getFotonVta } from "../controllers";

export const fotonRoute = Router();

fotonRoute.get("/inv", getFotonInv);

fotonRoute.get("/rep", getFotonRep);

fotonRoute.post("/vta", getFotonVta);


