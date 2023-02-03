import { Router } from "express";
import { getBajajInv, getBajajrep } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);

bajajRoute.get("/rep", getBajajrep);

