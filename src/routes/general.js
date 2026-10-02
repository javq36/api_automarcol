import { Router } from "express";
import { getApiCartera,getApiCartera_taller,getApiInventario,getApiVentas,guardarMatricula } from "../controllers";

export const generalRoute = Router();

generalRoute.get("/getApiCartera", getApiCartera);
generalRoute.get("/getApiCartera_taller", getApiCartera_taller);

generalRoute.get("/getApiInventario", getApiInventario);

generalRoute.get("/getApiVentas", getApiVentas);

generalRoute.post('/PostMatriculas', guardarMatricula);
