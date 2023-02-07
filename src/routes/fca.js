import { Router } from "express";
import { getFcaInv, getFcaRep, getFcaVta } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);

fcaRoute.get("/rep", getFcaRep);

fcaRoute.post("/vta", getFcaVta);