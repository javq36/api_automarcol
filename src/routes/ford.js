import { Router } from "express";
import { getFordCarter, getFordInv, getFordrep, getFordrepAll, getFordVta } from "../controllers";

export const fordRoute = Router();

fordRoute.get("/inv", getFordInv);

fordRoute.get("/rep", getFordrep);

fordRoute.get("/rep/all", getFordrepAll);

fordRoute.get("/vta", getFordVta);

fordRoute.get("/carter", getFordCarter);