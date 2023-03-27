import { getConection } from "../databases/conection";
import { formatCOP, formatdate, paginateAll } from "../helpers/functions";

/* Method that search in all databases(Sales & Services) the client by plate. */
export const getFotonInv = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const foton = await pool.request().query(`select
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
    INVNUE01_2021_FOTON AS I1
    LEFT JOIN  VTANUE_FOTON_HISTORICO as vt on vt.Version_DescipcionModelo = I1.Version_DescipcionModelo
    LEFT JOIN img_modelo as img on img.modelo = I1.Version_DescipcionModelo`);

    if (!!foton) {
      const filteredCars = foton.recordset.reduce((uniqueCars, car) => {
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

export const getFotonRep = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const foton = await pool.request().query(`select distinct 
    I1.Bodega AS Marca,
    I1.NumeroParte AS Parte,
    I1.descripcion AS Descripcion,
    I1.existencia,
    I1.Costo$,
    img.otro AS otro,
    img.presentation_img AS presentation_img,
    img.carrousel_img AS carrousel_img,
    img.collage_img AS collage_img
    FROM REFINV01_2021_FOTON AS I1 -- cambiar la tabla por marca
    INNER JOIN img_modelo AS img ON img.modelo = I1.NumeroParte
`);

    if (!!foton) {
      const pricedReps = foton.recordset.map((rep) => {
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

export const getFotonRepAll = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const foton = await pool.request().query(`select distinct 
    I1.Bodega AS Marca,
    I1.NumeroParte AS Parte,
    I1.descripcion AS Descripcion,
    I1.existencia,
    I1.Costo$,
    img.otro AS otro,
    img.presentation_img AS presentation_img,
    img.carrousel_img AS carrousel_img,
    img.collage_img AS collage_img
    FROM REFINV01_2021_FOTON AS I1 -- cambiar la tabla por marca
    LEFT JOIN img_modelo AS img ON img.modelo = I1.NumeroParte
`);

    if (!!foton) {
      const pricedReps = foton.recordset.map((rep) => {
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

export const getFotonVta = async (req, res) => {
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

    const foton = await pool.request().query(`SELECT
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
    (h.bodega in(10))
    AND (h.fecha BETWEEN '${initialDate
      .toISOString()
      .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')
    AND (h.ventatotal > 0)`);

    const fotonDev = await pool.request().query(`SELECT
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
    (h.bodega in(10))
    AND (h.fecha BETWEEN '${initialDate
      .toISOString()
      .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')
    AND (h.ventatotal < 0)`);

    if (!!foton) {
      const sumVta = foton.recordset.reduce(
        (acc, row) => acc + row.ventatotal,
        0
      );
      const pricedReps = foton.recordset.map((rep) => {
        return {
          ...rep,
          ventatotal: formatCOP(parseInt(rep.ventatotal)),
        };
      });

      const sumDev = fotonDev.recordset.reduce(
        (acc, row) => acc + row.ventatotal,
        0
      );
      const pricedRepsDev = fotonDev.recordset.map((rep) => {
        return {
          ...rep,
          ventatotal: formatCOP(parseInt(rep.ventatotal)),
        };
      });

      let gananciaNeta = sumVta + sumDev;
      let fixedDate = formatdate(pricedReps);
      let fixedDateDev = formatdate(pricedRepsDev);
      const fixModel = fixedDate.map(
        ({ Ano_modelo, Version_DescipcionModelo, ...rest }) => ({
          ...rest,
          Modelo: `${Version_DescipcionModelo} ${Ano_modelo}`,
        })
      );

      const fixModelDev = fixedDateDev.map(
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

      const resultDev = fixModelDev.map((obj) => {
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
      return res.status(200).json([result, resultDev, sumVta, sumDev, gananciaNeta]);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFotonCarter = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const foton = await pool
      .request()
      .query(`select * from CARTER01_2021_FOTON`);

    if (!!foton) {
      return res.status(200).json(foton.recordset);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFotonVentastaller = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */
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

    const fotonMos = await pool.request()
      .query(`SELECT CONVERT(varchar, z.fecha, 103) AS FechaFactura, 
      z.tipo + '-' + CONVERT(varchar(15), z.numero) AS Factura, 
      CASE WHEN d .condicion = 01 THEN 'contado' ELSE 'Credito' END AS TipoPago, 
      z.descuento AS Descuento, 
      CASE WHEN z.vta_bruta = 0 THEN (CONVERT(money, ((z.vta_bruta + d .iva) - z.descuento) * - 1)) ELSE (CONVERT(money, ((z.vta_bruta + d .iva) - z.descuento))) END AS VentaTotal,
      CASE WHEN z.vta_bruta = 0 THEN CONVERT(money, z.costo * - 1) ELSE CONVERT(money, z.costo) END AS Costo, 
      z.vendedor AS CedulaAsesorComercial,
      t.nombres AS NombreAsesorComercial,
      z.nit AS NIT_Cedula, 
      '' as RazonSocial,
      te.nombres as NombreCliente, 
      te.direccion, ISNULL(te.telefono_1, '') AS Telefono, 
      ISNULL(te.celular, '') AS Celular, 
      ISNULL(te.mail, '') AS Email
  FROM            dbo.z_vta_repuestos AS z LEFT OUTER JOIN
      dbo.documentos AS d ON z.tipo = d.tipo AND z.numero = d.numero LEFT OUTER JOIN
      dbo.referencias AS r ON z.codigo = r.codigo LEFT OUTER JOIN
      dbo.terceros AS t ON z.vendedor = t.nit LEFT OUTER JOIN
      dbo.terceros AS te ON te.nit = z.nit LEFT OUTER JOIN
      dbo.terceros_nombres AS tn ON te.nit = tn.nit LEFT OUTER JOIN
      dbo.Crmv_terceros_medio_contacto AS cr ON te.id = cr.IdTerceros
  WHERE (z.nit <> 900531238) AND (z.tipo = 'FVMF') AND (z.fecha BETWEEN '${initialDate
    .toISOString()
    .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')`);

    const fotonMosDev = await pool.request()
      .query(`SELECT CONVERT(varchar, z.fecha, 103) AS FechaFactura, 
      z.tipo + '-' + CONVERT(varchar(15), z.numero) AS Factura, 
      CASE WHEN d .condicion = 01 THEN 'contado' ELSE 'Credito' END AS TipoPago, 
      z.descuento AS Descuento, 
      CASE WHEN z.vta_bruta = 0 THEN (CONVERT(money, ((z.vta_bruta + d .iva) - z.descuento) * - 1)) ELSE (CONVERT(money, ((z.vta_bruta + d .iva) - z.descuento))) END AS VentaTotal,
      CASE WHEN z.vta_bruta = 0 THEN CONVERT(money, z.costo * - 1) ELSE CONVERT(money, z.costo) END AS Costo, 
      z.vendedor AS CedulaAsesorComercial,
      t.nombres AS NombreAsesorComercial,
      z.nit AS NIT_Cedula, 
      '' as RazonSocial,
      te.nombres as NombreCliente, 
      te.direccion, ISNULL(te.telefono_1, '') AS Telefono, 
      ISNULL(te.celular, '') AS Celular, 
      ISNULL(te.mail, '') AS Email
  FROM            dbo.z_vta_repuestos AS z LEFT OUTER JOIN
      dbo.documentos AS d ON z.tipo = d.tipo AND z.numero = d.numero LEFT OUTER JOIN
      dbo.referencias AS r ON z.codigo = r.codigo LEFT OUTER JOIN
      dbo.terceros AS t ON z.vendedor = t.nit LEFT OUTER JOIN
      dbo.terceros AS te ON te.nit = z.nit LEFT OUTER JOIN
      dbo.terceros_nombres AS tn ON te.nit = tn.nit LEFT OUTER JOIN
      dbo.Crmv_terceros_medio_contacto AS cr ON te.id = cr.IdTerceros
  WHERE (z.nit <> 900531238) AND (z.tipo = 'DFMF') AND (z.fecha BETWEEN '${initialDate
    .toISOString()
    .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')`);

    const fotonTall = await pool.request()
      .query(`SELECT  CONVERT(varchar, v.fecha_facturacion, 103) AS FechaFactura, 
      LTRIM(RTRIM(v.tipo_num_fac)) AS Factura,  
      ISNULL(cp.descripcion, 'CONTADO') AS TipoPago,
     (
    CASE 
      WHEN clase_operacion = 'T' 
        AND v.descripcion_operacion NOT IN ('INSUMOS', 'CONTROL DE CALIDAD', 'LAVADO VEH REPARADO') 
        THEN valor_descuento 
      ELSE 0 
    END 
    +
    CASE 
      WHEN clase_operacion IN ('R', 'T') 
        AND v.descripcion_operacion IN ('INSUMOS', 'CONTROL DE CALIDAD', 'LAVADO VEH REPARADO') 
        THEN valor_descuento 
      ELSE 0 
    END
  ) AS Descuento, 
  v.Subtotal_venta - v.Valor_descuento + v.IVA AS VentaTotal, 
  v.Subtotal_Costo AS Costo,
  v.nit_vendedor AS CedulaAsesorComercial, 
  ISNULL(v.Asesor, '') AS NombreAsesorComercial, 
  v.nit_cliente AS NIT_Cedula,
  ISNULL(v.razon_social, '') as RazonSocial,
  v.Cliente AS NombreCliente, 
  ISNULL(v.Direccion, '') AS direccion, 
  ISNULL(v.telefono_1, '') AS Telefono1, 
  ISNULL(v.celular_1, '') AS Celular1, 
  ISNULL(v.telefono_2, '') AS Telefono2, 
  ISNULL(v.celular_2, '') AS Celular2, 
  ISNULL(v.email, '') AS Email
  FROM    dbo.v_tall_detalle_simetrical AS v LEFT OUTER JOIN
          dbo.condiciones_pago AS cp ON v.condicion = cp.condicion
  WHERE   (v.bodega IN (14)) 
      AND (v.sw = 1)  AND (v.fecha_facturacion BETWEEN '${initialDate
        .toISOString()
        .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')`);

    const fotonTallDev = await pool.request()
      .query(`SELECT  CONVERT(varchar, v.fecha_facturacion, 103) AS FechaFactura, 
      LTRIM(RTRIM(v.tipo_num_fac)) AS Factura,  
      ISNULL(cp.descripcion, 'CONTADO') AS TipoPago,
     (
    CASE 
      WHEN clase_operacion = 'T' 
        AND v.descripcion_operacion NOT IN ('INSUMOS', 'CONTROL DE CALIDAD', 'LAVADO VEH REPARADO') 
        THEN valor_descuento 
      ELSE 0 
    END 
    +
    CASE 
      WHEN clase_operacion IN ('R', 'T') 
        AND v.descripcion_operacion IN ('INSUMOS', 'CONTROL DE CALIDAD', 'LAVADO VEH REPARADO') 
        THEN valor_descuento 
      ELSE 0 
    END
  ) AS Descuento, 
  v.Subtotal_venta - v.Valor_descuento + v.IVA AS VentaTotal, 
  v.Subtotal_Costo AS Costo,
  v.nit_vendedor AS CedulaAsesorComercial, 
  ISNULL(v.Asesor, '') AS NombreAsesorComercial, 
  v.nit_cliente AS NIT_Cedula,
  ISNULL(v.razon_social, '') as RazonSocial,
  v.Cliente AS NombreCliente, 
  ISNULL(v.Direccion, '') AS direccion, 
  ISNULL(v.telefono_1, '') AS Telefono1, 
  ISNULL(v.celular_1, '') AS Celular1, 
  ISNULL(v.telefono_2, '') AS Telefono2, 
  ISNULL(v.celular_2, '') AS Celular2, 
  ISNULL(v.email, '') AS Email
  FROM    dbo.v_tall_detalle_simetrical AS v LEFT OUTER JOIN
          dbo.condiciones_pago AS cp ON v.condicion = cp.condicion
  WHERE   (v.bodega IN (14)) 
      AND (v.sw = 2)  AND (v.fecha_facturacion BETWEEN '${initialDate
        .toISOString()
        .slice(0, 10)} 00:00:00.000' AND '${finalDate
      .toISOString()
      .slice(0, 10)} 23:59:59.999')`);

    if (!!fotonMos) {
      const fixedMos = fotonMos.recordset.map((obj) => {
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

      const fixedMosDev = fotonMosDev.recordset.map((obj) => {
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

      const fixedTall = fotonTall.recordset.map((obj) => {
        const cliente =
          obj.NombreCliente || obj.RazonSocial || "No se encontraron datos";
        const telefono =
          obj.Telefono1 || obj.Celular1 || obj.Telefono2 || obj.Celular2 ||"No se encontraron datos";

        const { NombreCliente, RazonSocial, Telefono1, Celular1, Telefono2, Celular2, ...newObj } =
          obj;

        return {
          ...newObj,
          Cliente: cliente,
          Telefono: telefono,
        };
      });

      const fixedTallDev = fotonTallDev.recordset.map((obj) => {
        const cliente =
          obj.NombreCliente || obj.RazonSocial || "No se encontraron datos";
        const telefono =
          obj.Telefono1 || obj.Celular1 || obj.Telefono2 || obj.Celular2 ||"No se encontraron datos";

        const { NombreCliente, RazonSocial, Telefono1, Celular1, Telefono2, Celular2, ...newObj } =
          obj;

        return {
          ...newObj,
          Cliente: cliente,
          Telefono: telefono,
        };
      });

      const totalVentas = fixedMos.concat(fixedTall)
      const totalDevoluciones = fixedMosDev.concat(fixedTallDev)

      const sumVta = totalVentas.reduce(
        (acc, row) => acc + row.VentaTotal,
        0
      );

      const sumDev = totalDevoluciones.reduce(
        (acc, row) => acc + row.VentaTotal,
        0
      );

      const totalNeto = sumVta + sumDev

      const pricedVta = totalVentas.map((rep) => {
        return {
          ...rep,
          VentaTotal: formatCOP(parseInt(rep.VentaTotal)),
        };
      });

      const pricedDev = totalDevoluciones.map((rep) => {
        return {
          ...rep,
          VentaTotal: formatCOP(parseInt(rep.VentaTotal)),
        };
      });

      return res
        .status(200)
        .json([
          pricedVta,
          pricedDev,
          sumVta,
          sumDev,
          totalNeto
        ]);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
