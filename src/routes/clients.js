import { Router } from "express";
import { getClients, getClientsById, getClientCarInfo } from "../controllers/";
import { validarCampos } from "../middlewares/";
import { check } from "express-validator";

export const clientRoute = Router();

clientRoute.get("/", getClients);

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

