import { mongoose} from "mongoose";

async function initMongoConnection() {
        try {
        const user = process.env.MONGODB_USER;
        const pwd = process.env.MONGODB_PASSWORD;
        const url = process.env.MONGODB_URL;
        const db = process.env.MONGODB_DB;

        await mongoose.connect(
        `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
        );
        console.log("Mongo connection successfully established!");
	} catch (error) {
	        console.error('Error while setting up mongo connection', error);
		throw(error);
	}
}

export { initMongoConnection };
