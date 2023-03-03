import { Router } from "express";
import { getFcaInv, getFcaRep, getFcaRepAll, getFcaVta } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);

fcaRoute.get("/rep", getFcaRep);

fcaRoute.get("/rep/all", getFcaRepAll);

fcaRoute.post("/vta", getFcaVta);
