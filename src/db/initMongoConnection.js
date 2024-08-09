import mongoose from "mongoose";
const URI = process.env.MONGODB_URL;

async function initMongoConnection() {
	try {
        await mongoose.connect(URI);
        console.log("Mongo connection successfully established!");
	} catch (error) {
		console.error(error);
		throw(error);
	}
}

export { initMongoConnection };
