import express from "express";
import cors from 'cors';
import pinoHTTP from "pino-http";
import 'dotenv/config';
import { ContactsCollection } from "./services/contacts.js";
const PORT = process.env.PORT || 3000;

function setupServer() {
    const app = express();

    app.use(cors());

    const pino = pinoHTTP({
        transport: {
            target: 'pino-pretty'
        }
    });
    app.use(pino);

    app.get("/contacts", async (req, res) => {
        try {
            const contacts = await ContactsCollection.find();
            res.send({status: 200, message: "Successfully found contacts!", data:  contacts});
        } catch (error) {
            res.status(500).send({status: 500, message: "Internal Server Error:", error});
        }
    });

    app.get("/contacts/:contactId", async (req, res) => {
        try{
            const {id} = req.params;
            const contact = await ContactsCollection.findById(id);
            if (contact === null) {
                res.status(404).send({message: "Contact not found"});
            }
            res.send({status: 200, message: `Successfully found contact with id ${id}`, data:  contact});
        } catch (error) {
            res.status(500).send({status: 500, message: "Internal Server Error", error});
        }
    });


    app.use((req, res, next) => {
        res.status(404).send({ status: 404, message: "Not found" });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export { setupServer };
