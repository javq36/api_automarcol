import { validationResult } from 'express-validator';


export const validarCampos = ( req, res, next ) => {

    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }

    res.status(422).json({ errors: result.array() });
}
