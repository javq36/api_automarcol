import express from "express";
import cors from "cors";
import config from "./config";
/* 
import clientsRoutes from "./routes/clients"; */
import * as routes from './routes'

const app = express();
let port = config.port;

//settings
app.set("port", port);

//middlewares
app.use(cors({
    origin: "*", // o restringe a tus dominios, ver nota abajo
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/bajaj', routes.bajajRoute)
app.use('/api/clients', routes.clientRoute)
app.use('/api/fca', routes.fcaRoute)
app.use('/api/ford', routes.fordRoute)
app.use('/api/foton', routes.fotonRoute)
app.use('/api/peugeot', routes.peugeotRoute)
app.use('/api/image', routes.imageRoute)
app.use('/api/general', routes.generalRoute)

export default app;
