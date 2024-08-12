import { ContactsCollection } from "../db/models/contacts.js";

export function getContacts() {
    return ContactsCollection.find();
}

export function getOneContact(contactId) {
    return ContactsCollection.findById(contactId);
};
