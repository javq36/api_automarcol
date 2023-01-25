import { getConection } from "../databases/conection";

/* Method that search in all databases(Sales & Services) the client by plate. */
export const getFordInv = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const ford = await pool.request().query(`select
    DISTINCT I1.Marca,
    I1.Version_DescipcionModelo,
    I1.Ano_Modelo,
    STUFF(
        (
            select
                ', ' + upper(I3.descripcion)
            from
                vh_colores as I3
                INNER JOIN INVNUE01_2021_2 as I2 on I2.CodigoColor = I3.color
            WHERE
                I2.Version_DescipcionModelo = I1.Version_DescipcionModelo FOR XML PATH('')
        ),
        1,
        2,
        ''
    ) AS Colores,
    I1.Costocompra,
    I1.Clase,
    '{
Presentacion1: "https://automarcol.com/fordcarrousel2.jpg",
Presentacion2: "https://automarcol.com/fordcarrousel2.jpg"
}' AS PresentationIMG,
    '{
Carrousel1: "https://automarcol.com/fordcarrousel2.jpg",
Carrousel2: "https://automarcol.com/fordcarrousel2.jpg"
}' AS CarrouselIMG,
    '{
"img1": "https://www.ford.com.co/content/ford/co/es_co/home/performance/raptor/jcr:content/par/brandgallery/image1/image.imgs.full.high.jpg/1635456003638.jpg"
"img2": "https://autonal.com/wp-content/uploads/2022/01/banner-web-nuevos-ford-generico-2-desktop.jpg"
}' AS CollageIMG,
    '' AS Traccion,
    '' AS Cilindraje,
    '' AS Combustible,
    '' AS Linea,
    '' AS Puertas,
    '' AS Pasajeros,
    '' AS Version,
    UPPER(I1.status) AS Status
from
    INVNUE01_2021_2 AS I1`);

    if (!!bajaj) {
      return res.status(200).json(ford.recordset);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "Placa de vehiculo no encontrada" });
  } catch (error) {
    res.status(500).json(error);
  }
};
