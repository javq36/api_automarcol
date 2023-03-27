import { Router } from "express";
import { getFcaCarter, getFcaInv, getFcaRep, getFcaRepAll, getFcaVentastaller, getFcaVta } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);

fcaRoute.get("/rep", getFcaRep);

fcaRoute.get("/rep/all", getFcaRepAll);

fcaRoute.post("/vta", getFcaVta);

fcaRoute.post("/vtaTall", getFcaVentastaller);

fcaRoute.get("/carter", getFcaCarter);
