import express from "express";
import cors from 'cors';
import pinoHTTP from "pino-http";
import 'dotenv/config';
const PORT = process.env.PORT || 3000;
import { getAllContacts, getOneContact } from './services/contacts.js';

function setupServer() {
    const app = express();

    app.use(cors());

    app.use(pinoHTTP({
        transport: {
            target: 'pino-pretty'
        }
    }));

    app.get("/contacts", getAllContacts);

    app.get("/contacts/:contactId", getOneContact);

    app.use((req, res, next) => {
        res.status(404).send({ status: 404, message: "Not found" });
    });

    app.use((err, req, res, next) => {
        res.status(500).send({ status: 500, message: 'Something went wrong', error: err.message });
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export { setupServer };
