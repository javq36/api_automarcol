import { Router } from "express";
import { getClients, getClientsById, getClientCarInfo , getDocumentsTerceros , getMantenimientos, getTall , getNuevos, getimotriz , getMostradorEncuestas , getRecibosCaja, getRecibosCaja_U, getRecibosCaja_C, getDistribuidor } from "../controllers/";
import { validarCampos } from "../middlewares/";
import { check } from "express-validator";

export const clientRoute = Router();
clientRoute.post("/getRecibosCaja_U", getRecibosCaja_U);
clientRoute.post("/getRecibosCaja_C", getRecibosCaja_C);
clientRoute.post("/getRecibosCaja", getRecibosCaja);
clientRoute.get("/imotriz", getimotriz);
clientRoute.get("/getDistribuidor", getDistribuidor);
clientRoute.get("/mantenimientos", getMantenimientos);
clientRoute.post("/1105", getDocumentsTerceros);
clientRoute.post("/getTall", getTall);
clientRoute.post("/getNuevos", getNuevos);
clientRoute.get("/", getClients);
clientRoute.post("/getMostrador",getMostradorEncuestas);
clientRoute.post(
  "/id",
  [
    check("nit").not().isEmpty().withMessage("El campo nit es requerido"),
    validarCampos,
  ],
  getClientsById
);

clientRoute.post(
    "/carinfo",
    [
      check("plate").not().isEmpty().withMessage("El campo placa es requerido"),
      validarCampos,
    ],
    getClientCarInfo
  );

