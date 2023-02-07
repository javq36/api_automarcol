import { getConection } from "../databases/conection";
import { formatCOP, paginateAll, formatdate } from "../helpers/functions";

/* Method that search in all databases(Sales & Services) the client by plate. */
export const getBajajInv = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const bajaj = await pool.request().query(`select
    DISTINCT I1.Marca,
    I1.Version_DescipcionModelo,
    I1.Ano_Modelo,
    (
      (CONVERT(numeric(10, 0), I1.costocompra)) + (
          (
              (CONVERT(numeric(10, 0), I1.costocompra) * 0.16) +((CONVERT(numeric(10, 0), I1.costocompra)) * 0.19)
          )
      )
  ) as CostoTotal,
    I1.Clase,
    IMG.presentation_img AS PresentationIMG,
    IMG.carrousel_img AS CarrouselIMG,
    IMG.collage_img AS CollageIMG,
    IMG.traccion AS Traccion,
    IMG.cilindraje AS Cilindraje,
    IMG.combustible AS Combustible,
    IMG.Puertas AS Puertas,
    IMG.cojineria AS Cojineria,
    IMG.otro AS Otro,
    UPPER(I1.status) AS Status
from
    INVNUE01_2021_BAJAJ AS I1
    LEFT JOIN INVNUE01_2021_BAJAJ as vt on vt.Version_DescipcionModelo = I1.Version_DescipcionModelo
    LEFT JOIN img_modelo as img on img.modelo = I1.Version_DescipcionModelo`);

    if (!!bajaj) {
      const filteredCars = bajaj.recordset.reduce((uniqueCars, car) => {
        const version = car.Version_DescipcionModelo.trim().toUpperCase();
        if (
          car.CostoTotal >= 0 &&
          !uniqueCars.some(
            (uniqueCar) =>
              uniqueCar.Version_DescipcionModelo.trim().toUpperCase() ===
              version
          )
        ) {
          car.Version_DescipcionModelo = version;
          uniqueCars.push(car);
        }
        return uniqueCars;
      }, []);

      const pricedCars = filteredCars.map((car) => {
        return {
          ...car,
          CostoTotal: formatCOP(parseInt(car.CostoTotal)),
        };
      });
      return res.status(200).json(pricedCars);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getBajajrep = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const bajaj = await pool.request().query(`select distinct 
    I1.Bodega AS Marca,
    I1.NumeroParte AS Parte,
    I1.descripcion AS Descripcion,
    I1.existencia,
    I1.Costo AS Costo$,
    img.otro AS otro,
    img.presentation_img AS presentation_img,
    img.carrousel_img AS carrousel_img,
    img.collage_img AS collage_img
    FROM REFINV01_2021_BAJAJ AS I1 -- cambiar la tabla por marca
    LEFT JOIN img_modelo AS img ON img.modelo = I1.NumeroParte`);

    if (!!bajaj) {
      const pricedReps = bajaj.recordset.map((rep) => {
        return {
          ...rep,
          Costo$: formatCOP(parseInt(rep.Costo$)),
        };
      });

      let result = paginateAll(pricedReps, 20);
      return res.status(200).json(result);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getBajajVta = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  let {
    initialMonth,
    finalMonth,
    initialYear,
    finalYear,
    initialDay,
    finalDay,
  } = req.body;

  const today = new Date();

  if (initialMonth === "" && initialYear === "") {
    initialMonth = String(today.getMonth() + 1);
    finalMonth = initialMonth;
    initialYear = String(today.getFullYear());
    finalYear = initialYear;
    initialDay = "1";
    finalDay = String(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    );
  }

  const initialString = `${initialYear}-${initialMonth}-${initialDay}`;
  const finalString = `${finalYear}-${finalMonth}-${finalDay}`;
  const initialDate = new Date(Date.parse(initialString));
  const finalDate = new Date(Date.parse(finalString));

  try {
    /* A query to the Service database. */

    const bajaj = await pool.request().query(`SELECT
    h.fecha AS FechaFactura,
    h.tipo + '-' + CONVERT(varchar(15), h.numero) AS Factura,
    d.fecha AS FechaPedido,
    d.numero AS NumeroPedido,
    b.serie AS Vin,
    h.ventatotal,
    b.modelo_ano AS Ano_modelo,
    b.des_marca AS Marca,
    b.des_modelo AS Version_DescipcionModelo,
    b.tipo AS clase,
    b.des_color AS ColorPintura,
    ISNULL(b.placa, '') AS Placa,
    d.vendedor AS CedulaAsesorComercial,
    g.nombres AS NombreAsesorComercial,
    d.nit AS Nit_Cedula,
    CASE
      WHEN e.tipo_identificacion = 'N' THEN e.nombres
      ELSE ''
    END AS RazonSocial,
    ISNULL(e.nombres, '') AS NombreCliente,
    ISNULL(e.direccion, '') AS Direccion,
    ISNULL(e.telefono_1, '') AS Telefono,
    ISNULL(e.celular, '') AS Celular,
    ISNULL(e.mail, '') AS Email
  FROM
    dbo.v_vh_vehiculos AS b
    LEFT OUTER JOIN dbo.vh_familias AS c ON b.familia = c.familia
    LEFT OUTER JOIN dbo.vh_documentos_ped AS d ON b.codigo = d.codigo
    LEFT OUTER JOIN dbo.terceros AS e ON d.nit = e.nit
    LEFT OUTER JOIN dbo.terceros_nombres AS f ON e.nit = f.nit
    LEFT OUTER JOIN dbo.terceros AS g ON d.vendedor = g.nit
    LEFT OUTER JOIN dbo.v_documentos_valores_otras_marcas AS h ON d.codigo = h.codigo
    AND d.plan_venta = 1
    LEFT OUTER JOIN dbo.vh_eventos_vehiculos AS i ON d.codigo = i.codigo
    AND i.evento = 00
    LEFT OUTER JOIN dbo.vh_eventos_vehiculos AS j ON d.codigo = j.codigo
    AND j.evento = 75
    LEFT OUTER JOIN dbo.vh_eventos_vehiculos AS k ON d.codigo = k.codigo
    AND k.evento = 55
    LEFT OUTER JOIN dbo.Crmv_terceros_medio_contacto AS l ON e.id = l.IdTerceros
    LEFT OUTER JOIN dbo.vh_creditos AS m ON d.IdNegocio = m.negocio
    LEFT OUTER JOIN (
      SELECT
        d.tipo,
        d.numero,
        dl.codigo,
        dl.valor_unitario,
        dl.costo_unitario
      FROM
        dbo.documentos AS d
        LEFT OUTER JOIN (
          SELECT
            tipo,
            numero,
            codigo,
            valor_unitario,
            costo_unitario
          FROM
            dbo.documentos_lin
          WHERE
            (sw = 3)
        ) AS dl ON d.tipo = dl.tipo
        AND d.numero = dl.numero
    ) AS n ON b.codigo = n.codigo
    LEFT OUTER JOIN (
      SELECT
        numero,
        forma,
        valor,
        'Si' AS retoma,
        CASE
          WHEN forma = 6 THEN 'Directo'
          WHEN forma = 10 THEN 'Tercero'
        END AS tipoRetoma
      FROM
        dbo.vh_documentos_ped_pago
      WHERE
        (forma IN (10, 6))
    ) AS o ON d.numero = o.numero
    LEFT OUTER JOIN (
      SELECT
        z.numero,
        z.forma,
        z.valor
      FROM
        (
          SELECT
            numero,
            MAX(valor) AS valor
          FROM
            (
              SELECT
                numero,
                forma,
                SUM(valor) AS valor
              FROM
                dbo.vh_documentos_ped_pago AS vh_documentos_ped_pago_2
              GROUP BY
                numero,
                forma
            ) AS x
          GROUP BY
            numero
        ) AS y
        LEFT OUTER JOIN (
          SELECT
            numero,
            forma,
            SUM(valor) AS valor
          FROM
            dbo.vh_documentos_ped_pago AS vh_documentos_ped_pago_1
          GROUP BY
            numero,
            forma
        ) AS z ON y.numero = z.numero
        AND y.valor = z.valor
    ) AS p ON d.numero = p.numero
    LEFT OUTER JOIN dbo.terceros AS q ON d.nit_prenda = q.nit
  WHERE
    (h.bodega in(19))
    AND (h.fecha BETWEEN '${initialDate
      .toISOString()
      .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')
    AND (h.ventatotal > 0)`);

    if (!!bajaj) {
      const pricedReps = bajaj.recordset.map((rep) => {
        return {
          ...rep,
          ventatotal: formatCOP(parseInt(rep.ventatotal)),
        };
      });

      let fixedDate = formatdate(pricedReps);
      const fixModel = fixedDate.map(
        ({ Ano_modelo, Version_DescipcionModelo, ...rest }) => ({
          ...rest,
          Modelo: `${Version_DescipcionModelo} ${Ano_modelo}`,
        })
      );

      const result = fixModel.map((obj) => {
        const cliente =
          obj.NombreCliente || obj.RazonSocial || "No se encontraron datos";
        const telefono =
          obj.Telefono || obj.Celular || "No se encontraron datos";

        const { NombreCliente, RazonSocial, Telefono, Celular, ...newObj } =
          obj;

        return {
          ...newObj,
          Cliente: cliente,
          Telefono: telefono,
        };
      });
      return res.status(200).json(result);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
