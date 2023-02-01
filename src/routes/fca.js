import { Router } from "express";
import { getFcaInv, getFcaRep } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);

fcaRoute.get("/rep", getFcaRep);
