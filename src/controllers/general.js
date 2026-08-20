
import { getConection } from "../databases/conection";

export const getApiCartera = async (req, res) => {
  const pool = await getConection();
  try {
    const CONQ = await pool
      .request()
      .query(`SELECT * from API_CARTERA`);
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
      .query(`select * from TBL_API_VENTAS`);
    if (!!CONQ) {
      return res.status(200).json(CONQ.recordset);
    }
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const guardarMatricula = async (req, res) => {
  const pool = await getConection();
  const {
    Vin,
    Factura,
    Lugar,
    Placa,
    Encargado,
    Matriculado,
    Solicitud,
    Garantia,
    Entrega,
    Contacto,
    Comision,
    Impu,
    Matri,
    Soat,
    Csoat,
    Smatri,
    Tr,
    Extra,
    R1,
    R2,
    R3,
    accion // 'guardar' | 'alistamiento' | 'entrega'
  } = req.body;

  if (!Vin) {
    return res.status(400).json({ success: false, message: 'VIN no proporcionado.' });
  }

  // Convierte '' a null para que las fechas y numéricos no truenen en SQL Server
  const nullIfEmpty = (v) => (v === '' || v === undefined ? null : v);

  try {
    const request = pool.request();

    request.input('Vin', Vin);
    request.input('Lugar', nullIfEmpty(Lugar));
    request.input('Placa', nullIfEmpty(Placa));
    request.input('Encargado', nullIfEmpty(Encargado));
    request.input('Matriculado', nullIfEmpty(Matriculado));
    request.input('Solicitud', nullIfEmpty(Solicitud));
    request.input('Garantia', nullIfEmpty(Garantia));
    request.input('Entrega', nullIfEmpty(Entrega));
    request.input('Contacto', nullIfEmpty(Contacto));
    request.input('Comision', nullIfEmpty(Comision));
    request.input('Impu', nullIfEmpty(Impu));
    request.input('Matri', nullIfEmpty(Matri));
    request.input('Soat', nullIfEmpty(Soat));
    request.input('Csoat', nullIfEmpty(Csoat));
    request.input('Smatri', nullIfEmpty(Smatri));
    request.input('Tr', nullIfEmpty(Tr));
    request.input('Extra', nullIfEmpty(Extra));
    request.input('R1', nullIfEmpty(R1));
    request.input('R2', nullIfEmpty(R2));
    request.input('R3', nullIfEmpty(R3));

    await request.query(`
      MERGE API_MATRICULAS AS target
      USING (SELECT @Vin AS Vin) AS source
      ON (target.Vin = source.Vin)
      WHEN MATCHED THEN
        UPDATE SET
          Lugar = @Lugar,
          Placa = @Placa,
          Encargado = @Encargado,
          Matriculado = @Matriculado,
          Solicitud = @Solicitud,
          Garantia = @Garantia,
          Entrega = @Entrega,
          Contacto = @Contacto,
          Comision = @Comision,
          Impu = @Impu,
          Matri = @Matri,
          Soat = @Soat,
          Csoat = @Csoat,
          Smatri = @Smatri,
          Tr = @Tr,
          Extra = @Extra,
          R1 = @R1,
          R2 = @R2,
          R3 = @R3
      WHEN NOT MATCHED THEN
        INSERT (Vin, Lugar, Placa, Encargado, Matriculado, Solicitud, Garantia,
                Entrega, Contacto, Comision, Impu, Matri, Soat, Csoat, Smatri,
                Tr, Extra, R1, R2, R3)
        VALUES (@Vin, @Lugar, @Placa, @Encargado, @Matriculado, @Solicitud, @Garantia,
                @Entrega, @Contacto, @Comision, @Impu, @Matri, @Soat, @Csoat, @Smatri,
                @Tr, @Extra, @R1, @R2, @R3);
    `);

    res.status(200).json({ success: true, message: 'Datos guardados correctamente.' });
  } catch (error) {
    console.error('Error al guardar matrícula:', error);
    res.status(500).json({ success: false, message: 'Error al guardar los datos.' });
  }
};
