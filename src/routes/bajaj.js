import { Router } from "express";
import { getBajajCarter, getBajajInv, getBajajrep, getBajajrepAll, getBajajVta } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);

bajajRoute.get("/rep", getBajajrep);

bajajRoute.get("/rep/all", getBajajrepAll);

bajajRoute.get("/vta", getBajajVta);

bajajRoute.get("/carter", getBajajCarter);
