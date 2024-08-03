import { getConection } from "../databases/conection";

export const getNuevos = async (req, res) => {
  const pool = await getConection();
  const { bodega } = req.body;

  try {
    const request = pool.request();
    let sqlQuery = ''; // Inicializamos una variable para almacenar la consulta SQL

    if (bodega === '3') {
      sqlQuery = `
        -- Tu consulta SQL cuando bodega es igual a 3
        WITH CTE AS (
          SELECT
              CONVERT(CHAR(10), h.fecha, 120) AS FechaFactura,
              d.nit AS Nit_Cedula,
              e.nombres,
              COALESCE(
                  NULLIF(e.telefono_1, ''),
                  NULLIF(e.celular, ''),
                  NULLIF(e.telefono_2, ''),
                  NULLIF(e.celular2, '')
              ) AS Telefono,
              ISNULL(e.mail, '') AS Email,
              b.serie AS Vin,
              ISNULL(b.placa, '') AS Placa,
              b.modelo_ano AS Ano_modelo,
              b.des_marca AS Marca,
              b.des_modelo AS Version_DescipcionModelo,
              CONVERT(CHAR(10),  e.fecha_cumple_ter, 120) AS Fecha_Cumpleanos,
              ROW_NUMBER() OVER(PARTITION BY d.nit ORDER BY h.fecha DESC) AS RowNum
          FROM
              dbo.v_vh_vehiculos AS b
              LEFT OUTER JOIN dbo.vh_familias AS c ON b.familia = c.familia
              LEFT OUTER JOIN dbo.vh_documentos_ped AS d ON b.codigo = d.codigo
              LEFT OUTER JOIN dbo.terceros AS e ON d.nit = e.nit
              LEFT OUTER JOIN dbo.terceros_nombres AS f ON e.nit = f.nit
              LEFT OUTER JOIN dbo.terceros AS g ON d.vendedor = g.nit
              LEFT OUTER JOIN dbo.v_documentos_valores AS h ON d.codigo = h.codigo
                  AND d.plan_venta = 1
              LEFT OUTER JOIN dbo.terceros AS q ON d.nit_prenda = q.nit
          WHERE
              h.bodega = 3
        )
        SELECT
            FechaFactura,
            
            Nit_Cedula,
            nombres,
            Telefono,
            Email,
            Vin,
            Placa,
            Ano_modelo,
            Marca,
            Version_DescipcionModelo,
            Fecha_Cumpleanos
        FROM CTE
        WHERE RowNum = 1
        ORDER BY FechaFactura DESC;
      `;
    } else {
      sqlQuery = `
        -- Tu consulta SQL cuando bodega no es igual a 3
        WITH CTE AS (
          SELECT
              CONVERT(CHAR(10), h.fecha, 120) AS FechaFactura,
              d.nit AS Nit_Cedula,
              e.nombres,
              COALESCE(
                  NULLIF(e.telefono_1, ''),
                  NULLIF(e.celular, ''),
                  NULLIF(e.telefono_2, ''),
                  NULLIF(e.celular2, '')
              ) AS Telefono,
              ISNULL(e.mail, '') AS Email,
              b.serie AS Vin,
              ISNULL(b.placa, '') AS Placa,
              b.modelo_ano AS Ano_modelo,
              b.des_marca AS Marca,
              b.des_modelo AS Version_DescipcionModelo,
              CONVERT(CHAR(10),  e.fecha_cumple_ter, 120) AS Fecha_Cumpleanos,
              ROW_NUMBER() OVER(PARTITION BY d.nit ORDER BY h.fecha DESC) AS RowNum
          FROM
              dbo.v_vh_vehiculos AS b
              LEFT OUTER JOIN dbo.vh_familias AS c ON b.familia = c.familia
              LEFT OUTER JOIN dbo.vh_documentos_ped AS d ON b.codigo = d.codigo
              LEFT OUTER JOIN dbo.terceros AS e ON d.nit = e.nit
              LEFT OUTER JOIN dbo.terceros_nombres AS f ON e.nit = f.nit
              LEFT OUTER JOIN dbo.terceros AS g ON d.vendedor = g.nit
              LEFT OUTER JOIN dbo.v_documentos_valores_otras_marcas AS h ON d.codigo = h.codigo
                  AND d.plan_venta = 1
              LEFT OUTER JOIN dbo.terceros AS q ON d.nit_prenda = q.nit
          WHERE
              h.bodega = ${bodega}
        )
        SELECT
            FechaFactura,
            Nit_Cedula,
            nombres,
            Telefono,
            Email,
            Vin,
            Placa,
            Ano_modelo,
            Marca,
            Version_DescipcionModelo,
            Fecha_Cumpleanos
        FROM CTE
        WHERE RowNum = 1
        ORDER BY FechaFactura DESC;
      `;
    }

    const result = await request.query(sqlQuery);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
};


export const getTall = async (req, res) => {
  const pool = await getConection();
  let { bodega } = req.body;
  
  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`WITH CTE AS (
    SELECT
        CONVERT(varchar, v.fecha_facturacion, 103) as FechaFactura,
        v.nit_cliente AS NIT,
        RTRIM(v.descripcion_operacion) AS RazonIngreso,
        ISNULL(tc.nombres, 'no tiene') AS NombresCliente,
        COALESCE(
            NULLIF(v.telefono_1, ''),
            NULLIF(v.celular_1, ''),
            NULLIF(v.telefono_2, ''),
            NULLIF(v.celular_2, '')
        ) AS Telefono,
        ISNULL(v.email, '') AS Email,
        v.serie AS VIN,
        ISNULL(v.placa, '') AS Placa,
        v.ano_modelo AS AnoModelo,
        ISNULL(v.Marca, '') AS Marca,
        RTRIM(v.descripcion) AS DescripcionModelo,
        ISNULL(CONVERT(varchar, v.Fecha_Cumpleanos, 103), '') AS FechaCumpleaños,
        ROW_NUMBER() OVER (PARTITION BY v.nit_cliente ORDER BY v.fecha_facturacion DESC) AS RowNum
    FROM
        dbo.v_tall_detalle_simetrical AS v
        LEFT OUTER JOIN dbo.condiciones_pago AS cp ON v.condicion = cp.condicion
        LEFT OUTER JOIN dbo.terceros AS tc ON tc.nit = v.nit_cliente
    WHERE
        v.bodega = ${bodega}
        AND YEAR(v.fecha_facturacion) >= 2000
        AND v.clase_operacion in ('T','G','O')
        AND v.tipo_num_fac NOT LIKE '%FTI%'
        AND v.sw = 1
)
SELECT
    FechaFactura,
    NIT,
    RazonIngreso,
    NombresCliente,
    Telefono,
    Email,
    VIN,
    Placa,
    AnoModelo,
    Marca,
    DescripcionModelo,
    FechaCumpleaños
FROM
    CTE
WHERE
    RowNum = 1
ORDER BY FechaFactura desc	
;
;

  `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getimotriz = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`Select * from iMotriz`);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getDistribuidor = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`Select * from REFINV01_2021_SUBDISTRIBUIDOR`);
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
export const getMostradorEncuestas = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { initialMonth, finalMonth, initialYear, finalYear } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`
        select 
	dc.tipo,
	dc.numero,
	dc.nit,
	dc.fecha,
	UPPER(tc.nombres),
	UPPER(tc.mail)
	from documentos dc
	left join terceros tc on dc.nit = tc.nit 
	where
	dc.sw = 1
	and tipo not like '%FTI%'
	and YEAR(dc.fecha) = ${finalYear}
	and MONTH(dc.fecha) = ${finalMonth}
	and dc.anulado = 0
	and tc.mail IS NOT NULL
	and tc.mail LIKE '%_@__%.__%';
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getRecibosCaja = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { initialMonth, finalMonth, initialYear, finalYear } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`
	SELECT DISTINCT 
	d.tipo,
	d.numero,
	d.nit,
	UPPER(tc.nombres) as nombres,
	tc.mail,
	tc.direccion,
	tc.celular,
	d.fecha_hora,
	d.valor_total,
	d.anulado,
	d.usuario,
	dc.tipo_aplica,
	dc.numero_aplica,
	dc.valor as valor_aplica,
	dc.descuento as descuento_aplica,
	dc.retencion as retencion_aplica,
	dc.retencion_iva as retencion_iva_aplica
	FROM documentos as d
	LEFT JOIN terceros as tc on tc.nit = d.nit
	LEFT JOIN documentos_cruce dc on dc.tipo = d.tipo and dc.numero = d.numero
	 WHERE d.tipo = 'RC' 
      AND d.anulado = 0
      AND (
          (YEAR(d.fecha) BETWEEN ${initialYear} AND ${finalYear})
          OR (YEAR(d.fecha) = ${initialYear} AND MONTH(d.fecha) >= ${initialMonth})
          OR (YEAR(d.fecha) = ${finalYear} AND MONTH(d.fecha) <= ${finalMonth})
      )
      AND tc.mail IS NOT NULL
      AND tc.mail LIKE '%_@__%.__%';
      `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getRecibosCaja_U = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { numero } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`
	SELECT DISTINCT 
	d.tipo,
	d.numero,
	d.nit,
	UPPER(tc.nombres) as nombres,
	tc.mail,
	tc.direccion,
	tc.celular,
	d.fecha_hora,
	d.valor_total,
	d.anulado,
	d.usuario,
	dc.tipo_aplica,
	dc.numero_aplica,
	dc.valor as valor_aplica,
	dc.descuento as descuento_aplica,
	dc.retencion as retencion_aplica,
	dc.retencion_iva as retencion_iva_aplica
	FROM documentos as d
	LEFT JOIN terceros as tc on tc.nit = d.nit
	LEFT JOIN documentos_cruce dc on dc.tipo = d.tipo and dc.numero = d.numero
	 WHERE d.tipo = 'RC' 
      AND d. numero = ${numero}
      AND d.anulado = 0
      AND tc.mail IS NOT NULL
      AND tc.mail LIKE '%_@__%.__%';
      `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getRecibosCaja_C = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let { numero } = req.body;

  try {
    /* A query to the database. */
    const result = await pool
      .request()
      .query(`
       SELECT m.tipo, m.numero, m.seq, m.fec, datepart(year, m.fec) AS ano,datepart(month, m.fec) AS mes, m.cuenta, m.centro AS Cen,c.descripcion,Debito = CASE WHEN m.valor < 0 THEN 0 ELSE m.valor END,Credito = CASE WHEN m.valor > 0 THEN 0 ELSE m.valor * - 1 END,Debito_Niif = CASE WHEN m.valor_niif < 0 THEN 0 ELSE m.valor_niif END,Credito_Niif = CASE WHEN m.valor_niif > 0 THEN 0 ELSE m.valor_niif * - 1 END, Norma = c.norma, t.nombres AS Tercero, m.base, m.explicacion, m.nit,m.documento FROM movimiento m Join cuentas c On m.cuenta=c.cuenta Join terceros t On m.nit=t.nit 
	WHERE m.tipo='RC' 
	And m.numero=${numero} 
	order by m.seq;
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
