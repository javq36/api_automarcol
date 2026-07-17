
import { getConection } from "../databases/conection";

export const getApiCartera = async (req, res) => {
  const pool = await getConection();
  try {
    const CONQ = await pool
      .request()
      .query(`select * from API_CARTERA`);
    if (!!CONQ) {
      return res.status(200).json(CONQ.recordset);
    }
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getApiInventario = async (req, res) => {
  const pool = await getConection();
  try {
    const CONQ = await pool
      .request()
      .query(`select * from API_INVENTARIO`);
    if (!!CONQ) {
      return res.status(200).json(CONQ.recordset);
    }
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getApiVentas = async (req, res) => {
  const pool = await getConection();
  try {
    const CONQ = await pool
      .request()
      .query(`select * from API_VENTAS`);
    if (!!CONQ) {
      return res.status(200).json(CONQ.recordset);
    }
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
