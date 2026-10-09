import { Router } from "express";
import { getApiFinanciero, getApiFinanciero_d,getApiCartera_unidas,getApiCartera,getApiCartera_taller,getApiInventario,getApiVentas,guardarMatricula, getREFINV_ALL } from "../controllers";

export const generalRoute = Router();

generalRoute.get("/getApiCartera", getApiCartera);
generalRoute.get("/getApiCartera_taller", getApiCartera_taller);

generalRoute.get("/getApiInventario", getApiInventario);

generalRoute.get("/getApiVentas", getApiVentas);
generalRoute.get("/getApiCartera_unidas", getApiCartera_unidas);
generalRoute.post('/PostMatriculas', guardarMatricula);

generalRoute.get("/getREFINV_ALL", getREFINV_ALL);

generalRoute.get("/getApiFinanciero", getApiFinanciero);

generalRoute.get("/getApiFinanciero_d", getApiFinanciero_d);
