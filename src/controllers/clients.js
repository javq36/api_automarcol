import { getConection } from "../databases/conection";


export const getTall = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { bodega } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`SELECT DISTINCT
      CONVERT(varchar, v.fecha_facturacion, 103) as FechaFactura,
      v.tipo_num_fac AS Factura,
      ISNULL(CONVERT(varchar, v.entrada, 103), '') AS FechaApertura,
      ISNULL(v.placa, '') AS Placa,
      v.numero_orden AS NumeroOT,
      v.Descripcion_bodega AS Taller,
      RTRIM(v.razon) AS RazonIngreso,
      CASE
          WHEN v.clase_operacion = 'R' THEN 'Repuesto'
          WHEN v.clase_operacion = 'T' THEN 'Mano de Obra'
          WHEN v.clase_operacion = 'O' THEN 'Trabajo Externo'
      END AS ClasedeOperacion,
      v.descripcion_operacion AS DescripcionOperacion,
      v.descripcion AS Descripcion,
      ISNULL(NULLIF(v.nombre_operario, '*'), '') AS NombreTecnico,
      v.operario AS CedulaTecnico,
      v.Tiempo AS HorasFacturadas,
      ISNULL(v.Asesor, '') AS NombreAsesor,
      v.nit_cliente AS NIT,
      v.Tipo_persona AS TipoPersona,
      ISNULL(v.razon_social, '') AS RazonSocial,
      ISNULL(tc.nombres, 'no tiene') AS NombresCliente,
      ISNULL(CONVERT(varchar, v.Fecha_Cumpleanos, 103), '') AS FechaCumpleaños,
      ISNULL(v.Direccion, '') AS Direccion,
      ISNULL(v.telefono_1, '') AS Telefono1,
      ISNULL(v.celular_1, '') AS Celular1,
      ISNULL(v.telefono_2, '') AS Telefono2,
      ISNULL(v.celular_2, '') AS Celular2,
      ISNULL(v.email, '') AS Email,
      v.serie AS VIN,
      v.Tipo_Servicio AS TipoVehiculo,
      v.ano_modelo AS AnoModelo,
      ISNULL(v.Marca, '') AS Marca,
      SUBSTRING(v.linea_vehiculo, 1, 15) AS Linea,
      RTRIM(v.descripcion) AS DescripcionModelo
  FROM
      dbo.v_tall_detalle_simetrical AS v
      LEFT OUTER JOIN dbo.condiciones_pago AS cp ON v.condicion = cp.condicion
      LEFT OUTER JOIN dbo.terceros AS tc ON tc.nit = v.nit_cliente
  WHERE
      v.bodega = cast(${bodega} as int)
      --AND CONVERT(date, v.fecha_facturacion, 103) >= '2022'
      AND CONVERT(date, v.fecha_facturacion, 103) = '2023'
      AND v.clase_operacion = 'T'
      AND v.tipo_num_fac NOT LIKE '%FTI%'
      AND v.sw = 1
  ORDER BY FechaFactura DESC
  `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getMantenimientos = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`Select * from mantenimientos_cordinar`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getDocumentsTerceros = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { nit, initialMonth, finalMonth, initialYear, finalYear } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .input('nit', nit)
      .query(`
        SELECT d.*, t.nombres 
        FROM documentos d WITH (INDEX = IX_documentos_nit)  
        JOIN terceros t ON d.vendedor = t.nit  
        WHERE d.nit = @nit 
          AND d.sw IN (1, 2, 3, 4, 5, 6, 21, 22, 23, 31, 32) 
          AND d.anulado = 0 
          AND (
            (YEAR(d.fecha) >= ${initialYear} AND YEAR(d.fecha) <= ${finalYear})
            OR (YEAR(d.fecha) = ${initialYear} AND MONTH(d.fecha) >= ${initialMonth})
            OR (YEAR(d.fecha) = ${finalYear} AND MONTH(d.fecha) <= ${finalMonth})
          )
        ORDER BY d.fecha DESC
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const getClients = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let nit = "1090432665";

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`Select * from terceros where nit = ${nit}`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getClientsById = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { nit } = req.body;
  console.log("nit", nit);

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`Select * from terceros where nit = ${nit}`);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* Method that search in all databases(Sales & Services) the client by plate. */
export const getClientCarInfo = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { plate } = req.body;
  /* let principal = ['FORD', 'PEUGEOT', 'GRAND CHEROKEE', 'DODGE', 'FIAT', 'JEEP', 'RAM' ]; */
  let segundaSede = ["FOTON", "BAJAJ"];
  let sedeTaller = "";
  let test = "";

  try {
    /* A query to the Service database. */

    const taller = await pool.request().query(`SELECT NombresCliente,
      ApellidosCliente,
      Celular1,
      Email,
      VIN,
      DescripcionModelo,
      AnoModelo,
      Marca
      FROM SERVTA_HISTORICO
      where placa = '${plate}' 
      and factura NOT Like 'FTI%'
      ORDER BY factura desc
      OFFSET 0 Row
      FETCH NEXT 1 ROW ONLY`);

    /*   Validate if the query return params to the return the info or search in another database*/
    if (taller.recordset.length > 0) {
      let {
        NombresCliente = "No encontrado",
        ApellidosCliente = "No encontrado",
        Celular1 = "No encontrado",
        Email = "No encontrado",
        VIN = "No encontrado",
        DescripcionModelo = "No encontrado",
        AnoModelo = "No encontrado",
        Marca = "No encontrado",
      } = taller.recordset[0];

      if (segundaSede.includes(Marca)) {
        sedeTaller =
          "Av. 7 #21 Norte-2 a 21 Norte-110 Centro Empresarial la estación";
      } else {
        sedeTaller = "Av. Libertadores #2-160, Cúcuta, Norte de Santander";
      }

      NombresCliente = `${NombresCliente} ${ApellidosCliente}`;

      return res.status(200).json({
        NombresCliente,
        Celular1,
        Email,
        VIN,
        DescripcionModelo,
        AnoModelo,
        sedeTaller,
      });
    }

    /* A query to the FORD Sales database. */

    const vtaFord = await pool.request().query(`SELECT
      PrimerNombreCliente, 
      Celular, 
      Email, 
      Vin, 
      Version_DescipcionModelo, 
      Ano_modelo, 
      Marca
      FROM SERVTA_HISTORICO_FORD
      where placa = '${plate}' 
      and factura NOT Like 'FTI%'
      ORDER BY factura desc
      OFFSET 0 Row
      FETCH NEXT 1 ROW ONLY`);

    /*   Validate if the query return params to the return the info or search in another database*/
    if (vtaFord.recordset.length > 0) {
      let {
        PrimerNombreCliente = "No encontrado",
        Celular = "No encontrado",
        Email = "No encontrado",
        Vin = "No encontrado",
        Version_DescipcionModelo = "No encontrado",
        Ano_modelo = "No encontrado",
        Marca = "No encontrado",
      } = vtaFord.recordset[0];

      if (segundaSede.includes(Marca)) {
        sedeTaller =
          "Av. 7 #21 Norte-2 a 21 Norte-110 Centro Empresarial la estación";
      } else {
        sedeTaller = "Av. Libertadores #2-160, Cúcuta, Norte de Santander";
      }

      return res.status(200).json({
        NombresCliente: PrimerNombreCliente,
        Celular1: Celular,
        Email,
        VIN: Vin,
        DescripcionModelo: Version_DescipcionModelo,
        AnoModelo: Ano_modelo,
        sedeTaller,
      });
    }

    /* A query to the All brands Sales database. */
    const vtaAll = await pool.request().query(`SELECT
    PrimerNombreCliente, 
    Celular, 
    Telefono,
    Email, 
    Vin, 
    Version_DescipcionModelo, 
    Ano_modelo, 
    Marca
    FROM SERVTA_HISTORICO_ALL
    where placa = '${plate}' 
    and factura NOT Like 'FTI%'
    ORDER BY factura desc
    OFFSET 0 Row
    FETCH NEXT 1 ROW ONLY`);

    /*   Validate if the query return params to the return the info or search in another database*/

    if (vtaAll.recordset.length > 0) {
      let {
        PrimerNombreCliente = "No encontrado",
        Celular = "No encontrado",
        Telefono = "No encontrado",
        Email = "No encontrado",
        Vin = "No encontrado",
        Version_DescipcionModelo = "No encontrado",
        Ano_modelo = "No encontrado",
        Marca = "No encontrado",
      } = vtaAll.recordset[0];

      if (segundaSede.includes(Marca)) {
        sedeTaller =
          "Av. 7 #21 Norte-2 a 21 Norte-110 Centro Empresarial la estación";
      } else {
        sedeTaller = "Av. Libertadores #2-160, Cúcuta, Norte de Santander";
      }

      if (Celular === "" || Celular === "No encontrado" || Celular === null) {
        Celular = Telefono;
      }

      return res.status(200).json({
        NombresCliente: PrimerNombreCliente,
        Celular1: Celular,
        Email,
        VIN: Vin,
        DescripcionModelo: Version_DescipcionModelo,
        AnoModelo: Ano_modelo,
        sedeTaller,
      });
    }

    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "Placa de vehiculo no encontrada" });
  } catch (error) {
    res.status(500).json(error);
  }
};
