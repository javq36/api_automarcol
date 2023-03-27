import { Router } from "express";
import { getBajajCarter, getBajajInv, getBajajrep, getBajajrepAll, getBajajVentastaller, getBajajVta } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);

bajajRoute.get("/rep", getBajajrep);

bajajRoute.get("/rep/all", getBajajrepAll);

bajajRoute.post("/vta", getBajajVta);

bajajRoute.post("/vtaTall", getBajajVentastaller);

bajajRoute.get("/carter", getBajajCarter);
