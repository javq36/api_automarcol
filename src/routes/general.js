import { Router } from "express";
import { getApiCartera,getApiInventario,getApiVentas,guardarMatricula } from "../controllers";

export const generalRoute = Router();

generalRoute.get("/getApiCartera", getApiCartera);

generalRoute.get("/getApiInventario", getApiInventario);

generalRoute.get("/getApiVentas", getApiVentas);

generalRoute.post('/matriculas/guardar', guardarMatricula);
