import { getConection } from "../databases/conection";

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
    VT.CostoTotal,
    I1.Clase,
    IMG.presentation_img AS PresentationIMG,
    IMG.traccion AS Traccion,
    IMG.cilindraje AS Cilindraje,
    '' AS Combustible,
    IMG.Puertas AS Puertas,
    IMG.cojineria AS Cojineria,
    UPPER(I1.status) AS Status
from
    INVNUE01_2021_BAJAJ AS I1
    INNER JOIN INVNUE01_2021_BAJAJ as vt on vt.Version_DescipcionModelo = I1.Version_DescipcionModelo
    INNER JOIN img_modelo as img on img.modelo = I1.Version_DescipcionModelo`);

    if(!!bajaj){
        return res.status(200).json(bajaj.recordset);
    }
    /*  if everything else fails, return a 404 error. */
    return res.status(404).json({ message: "operation failed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
