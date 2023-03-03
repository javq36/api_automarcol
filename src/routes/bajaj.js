import { Router } from "express";
import { getBajajInv, getBajajrep, getBajajrepAll, getBajajVta } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);

bajajRoute.get("/rep", getBajajrep);

bajajRoute.get("/rep/all", getBajajrepAll);

bajajRoute.post("/vta", getBajajVta);