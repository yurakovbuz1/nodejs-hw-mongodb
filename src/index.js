import { initMongoConnection } from "./db/initMongoConnection";
import { setupServer } from "./server";

initMongoConnection()
    .then(setupServer());
