import { Router } from "express";
import { validarCampos } from "../middlewares";
import { check } from "express-validator";
import { getBajajInv } from "../controllers/bajaj";

export const bajajRoute = Router();

bajajRoute.get("/inv", getBajajInv);


/* router.post('/clientsById', getClientsById); */

