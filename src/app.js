import express from "express";
import cors from 'cors';
import pinoHTTP from "pino-http";
import contactsRouter from './routes/contacts.js';

const app = express();

app.use(cors());

app.use(pinoHTTP({
    transport: {
        target: 'pino-pretty'
    }
}));

app.use('/contacts', contactsRouter);

app.use((req, res, next) => {
    res.status(404).send({ status: 404, message: "Not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ status: 500, message: 'Something went wrong', error: err.message });
});

export default app;
