import { getConection } from "../databases/conection";

/* Method that search in all databases(Sales & Services) the client by plate. */
export const getBajajInv = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();

  try {
    /* A query to the Service database. */

    const bajaj = await pool.request().query(`select
    DISTINCT I1.Version_DescipcionModelo,
    I1.Marca,
    I1.Ano_Modelo,
    I1.Costocompra,
    I1.Clase,
    '{
Presentacion1: "https://automarcol.com/fordcarrousel2.jpg",
Presentacion2: "https://automarcol.com/fordcarrousel2.jpg"
}' AS PresentationIMG,
    '' AS Traccion,
    '' AS Cilindraje,
    '' AS Combustible,
    '' AS Puertas,
    UPPER(I1.status) AS Status
from
    INVNUE01_2021_BAJAJ AS I1
WHERE
    I1.status = 'disponible'`);

    if(!!bajaj){
        return res.status(200).json(bajaj.recordset);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "Placa de vehiculo no encontrada" });
  } catch (error) {
    res.status(500).json(error);
  }
};
