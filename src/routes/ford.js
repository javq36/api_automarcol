import { Router } from "express";
import { getFordInv, getFordrep, getFordVta } from "../controllers";

export const fordRoute = Router();

fordRoute.get("/inv", getFordInv);

fordRoute.get("/rep", getFordrep);

fordRoute.get("/vta", getFordVta);