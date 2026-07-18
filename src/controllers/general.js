
import { getConection } from "../databases/conection";

export const getApiCartera = async (req, res) => {
  const pool = await getConection();
  try {
    const CONQ = await pool
      .request()
      .query(`
          SELECT
        a.Factura,
        a.nit_Cedula,
        a.NombresCliente,
        a.Saldo as costo,
        a.SaldoCorriente as saldo,
        a.Saldo - a.SaldoCorriente as abonado,
        b.CostoTotal,
        b.Vin,
        b.ventatotal,
        b.Marca,
        b.Version_DescripcionModelo,
        b.Ano_modelo,
        b.color,
        FORMAT(b.fechafactura, 'yyyy-MM-dd') AS FechaFactura,
        b.notas2 as comentarios,
        d.notas as notas_compra,
        DATEDIFF(day, b.fechafactura, GETDATE()) AS dias,
        b.NombreAsesorComercial,
        FORMAT(b.fechafactura, 'yyyy-MM') AS ym,
        CASE
            WHEN b.condicion = 1 THEN 'CREDITO'
            ELSE 'CONTADO'
        END AS condicion
    FROM CARTERA_UNIDAS as a
    LEFT JOIN API_VENTAS as b
        ON b.Factura = a.Factura
    LEFT JOIN documentos as o
        ON o.tipo = LEFT(a.Factura, CHARINDEX('-', a.Factura) - 1)
       AND o.numero = CAST(
            RIGHT(
                a.Factura,
                LEN(a.Factura) - CHARINDEX('-', a.Factura)
            ) AS INT
        )
    OUTER APPLY (
        SELECT TOP 1 c.tipo, c.numero
        FROM documentos_lin c
        WHERE c.codigo = b.Vin
          AND c.sw = 3
        ORDER BY c.numero DESC
    ) c
    OUTER APPLY (
        SELECT TOP 1 dd.notas
        FROM documentos dd
        WHERE dd.tipo = c.tipo
          AND dd.numero = c.numero
          AND dd.sw = 3
    ) d
    WHERE a.TipoCartera = 'Vehículos'
      AND a.Factura != 'FVN-2484'
    ORDER BY ym ASC;
      `);
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
