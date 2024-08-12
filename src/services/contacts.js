import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactsCollection.find();
        res.send({ status: 200, message: "Successfully found contacts!", data: contacts });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error:", error });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contact = await ContactsCollection.findById(contactId);
        if (contact === null) {
            return res.status(404).send({ message: "Contact not found" });
        }
        res.send({ status: 200, message: `Successfully found contact with id ${contactId}`, data: contact });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error", error });
    }
};
