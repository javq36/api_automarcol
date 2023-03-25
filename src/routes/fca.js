import { Router } from "express";
import { getFcaCarter, getFcaInv, getFcaRep, getFcaRepAll, getFcaVta } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);

fcaRoute.get("/rep", getFcaRep);

fcaRoute.get("/rep/all", getFcaRepAll);

fcaRoute.get("/vta", getFcaVta);

fcaRoute.get("/carter", getFcaCarter);
