import { Router } from "express";
import { getApiCartera,getApiCartera_taller,getApiInventario,getApiVentas,guardarMatricula, getREFINV_ALL } from "../controllers";

export const generalRoute = Router();

generalRoute.get("/getApiCartera", getApiCartera);
generalRoute.get("/getApiCartera_taller", getApiCartera_taller);

generalRoute.get("/getApiInventario", getApiInventario);

generalRoute.get("/getApiVentas", getApiVentas);

generalRoute.post('/PostMatriculas', guardarMatricula);

generalRoute.get("/getREFINV_ALL", getREFINV_ALL);
