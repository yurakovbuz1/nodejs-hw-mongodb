import express from "express";
import cors from 'cors';
import pinoHTTP from "pino-http";
import 'dotenv/config';
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

    app.use((req, res, next) => {
        res.status(404).send({ status: 404, message: "Not found" });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export { setupServer };
