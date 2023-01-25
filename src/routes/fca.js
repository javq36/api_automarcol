import { Router } from "express";
import { getFcaInv } from "../controllers";

export const fcaRoute = Router();

fcaRoute.get("/inv", getFcaInv);


/* router.post('/clientsById', getClientsById); */

