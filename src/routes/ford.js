import { Router } from "express";
import { getFordCarter, getFordInv, getFordrep, getFordrepAll, getFordVentastaller, getFordVta } from "../controllers";

export const fordRoute = Router();

//fordRoute.get("/inv", getFordInv);

fordRoute.get("/rep", getFordrep);

fordRoute.get("/rep/all", getFordrepAll);

fordRoute.post("/vta", getFordVta);

fordRoute.post("/vtaTall", getFordVentastaller);

fordRoute.get("/carter", getFordCarter);