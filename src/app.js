import  express  from "express";
import config from "./config";
/* 
import clientsRoutes from "./routes/clients"; */

import * as routes from './routes'

const app = express();

let port = config.port;

//settings
app.set("port", port);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/clients', routes.clientRoute)
app.use('/api/bajaj', routes.bajajRoute)

export default app;