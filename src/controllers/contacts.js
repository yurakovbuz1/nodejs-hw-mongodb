import createHttpError from 'http-errors';
import {getContacts, getOneContact} from '../services/contacts.js';

export async function getContactsController(req, res, next) {
    const contacts = await getContacts();
    res.send({ status: 200, message: "Successfully found contacts!", data: contacts });
};

export async function getOneContactController(req, res, next) {
    const { contactId } = req.params;
    const contact = await getOneContact(contactId);
    if (contact === null) {
        return next(createHttpError(404, "Contact not found."));
    };
    res.send({ status: 200, message: `Successfully found contact with id ${contactId}`, data: contact });
};
