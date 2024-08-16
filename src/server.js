import 'dotenv/config';
import app from './app.js';
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
    try {
        await initMongoConnection();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });


    } catch (error) {
        console.error(error);
    }
};

bootstrap();
