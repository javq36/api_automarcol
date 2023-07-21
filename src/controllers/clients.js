import { getConection } from "../databases/conection";

export const getDocumentsTerceros = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { nit, fechaInicio, fechaFin } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .input('nit', nit) // Using parameter for 'nit'
      .input('fechaInicio', fechaInicio) // Using parameter for 'fechaInicio'
      .input('fechaFin', fechaFin) // Using parameter for 'fechaFin'
      .query(`
        SELECT d.*, t.nombres 
        FROM documentos d WITH (INDEX = IX_documentos_nit)  
        JOIN terceros t ON d.vendedor = t.nit  
        WHERE d.nit = @nit 
          AND d.sw IN (1, 2, 3, 4, 5, 6, 21, 22, 23, 31, 32) 
          AND d.anulado = 0 
          AND d.fecha BETWEEN @fechaInicio AND @fechaFin
        ORDER BY d.fecha, d.fecha_hora
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
