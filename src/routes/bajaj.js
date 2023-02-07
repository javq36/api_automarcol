import { Router } from "express";
import { getBajajInv, getBajajrep, getBajajVta } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);

bajajRoute.get("/rep", getBajajrep);

bajajRoute.post("/vta", getBajajVta);