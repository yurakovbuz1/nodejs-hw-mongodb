import { model, Schema } from "mongoose";

const contactSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	email: {
		type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        required: true,
        default: false
    },
    contactType: {
        type: String,
        enum: ["work", "home", "personal"],
        required: true,
        default: "personal"
    }
    }, {
        timestamp: true
});

export const ContactsCollection = model('contacts', contactSchema);
