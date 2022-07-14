import { getConection } from "../databases/conection";

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

export const getClientCarInfo = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { plate } = req.body;
  /* let principal = ['FORD', 'PEUGEOT', 'GRAND CHEROKEE', 'DODGE', 'FIAT', 'JEEP', 'RAM' ]; */
  let segundaSede = ['FOTON', 'BAJAJ'];
  let sedeTaller = "";

  try {
    /* A query to the database. */
    const result = await pool.request().query(`SELECT NombresCliente,
      ApellidosCliente,
      Celular1,
      Email,
      VIN,
      DescripcionModelo,
      AnoModelo,
      Marca
      FROM SERVTA01_2021_2
      where placa = '${plate}' 
      and factura NOT Like 'FTI%'
      ORDER BY factura desc
      OFFSET 0 Row
      FETCH NEXT 1 ROW ONLY`);

    if (result.recordset.length <= 0) return res.status(404).json({ message: "Placa de vehiculo no encontrada" });

    let {
      NombresCliente = "No encontrado",
      ApellidosCliente = "No encontrado",
      Celular1 = "No encontrado",
      Email = "No encontrado",
      VIN = "No encontrado",
      DescripcionModelo = "No encontrado",
      AnoModelo = "No encontrado",
      Marca = "No encontrado",
    } = result.recordset[0];
    
    if (segundaSede.includes(Marca)) {
       sedeTaller = "Av. 7 #21 Norte-2 a 21 Norte-110 Centro Empresarial la estación";
    }else{
      sedeTaller = "Av. Libertadores #2-160, Cúcuta, Norte de Santander";
    }

    res.status(200).json({
      NombresCliente,
      ApellidosCliente,
      Celular1,
      Email,
      VIN,
      DescripcionModelo,
      AnoModelo,
      sedeTaller
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
