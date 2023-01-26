import { getConection } from "../databases/conection";

/* Method that search in all databases(Sales & Services) the client by plate. */
export const updateImgModel = async (req, res) => {
  /* Getting the connection to the database. */
  const pool = await getConection();
  const {
    modelo,
    presentation_img,
    carrousel_img,
    collage_img,
    usuario,
    cilindraje,
    traccion,
    cojineria,
    puertas,
    combustible,
    otro,
  } = req.body;

  try {
    /* A query to the Service database. */
    const model = await pool
      .request()
      .query(`select * from img_modelo where modelo = '${modelo}'`);

    if (!!model && !!model.recordset[0]) {
      const request = await pool
        .request()
        .query(
          `update img_modelo set presentation_img = '${presentation_img}', carrousel_img = '${carrousel_img}', collage_img = '${collage_img}', usuario = '${usuario}', cilindraje = '${cilindraje}', traccion = '${traccion}', cojineria = '${cojineria}', puertas = '${puertas}', combustible = '${combustible}', otro = '${otro}' where modelo = '${modelo}'`
        );
      return res.status(200).json(request.recordset);
    } else {
      const request = await pool
        .request()
        .query(
          `insert into img_modelo (modelo, presentation_img, carrousel_img, collage_img, usuario, cilindraje, traccion, cojineria, puertas, combustible, otro) values ('${modelo}', '${presentation_img}', '${carrousel_img}', '${collage_img}', '${usuario}', '${cilindraje}', '${traccion}', '${cojineria}', '${puertas}', '${combustible}', '${otro}' )`
        );
        console.log(request.recordset)
      return res.status(202).json(request.recordset);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
