import express from "express";
import cors from 'cors';
import pinoHTTP from "pino-http";
import contactsRouter from './routes/contacts.js';
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";


const app = express();

app.use(cors());

app.use(pinoHTTP({
    transport: {
        target: 'pino-pretty'
    }
}));

app.use('/contacts', contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
