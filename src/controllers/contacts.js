import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContacts,
  getOneContact,
} from '../services/contacts.js';

export async function getContactsController(req, res, next) {
  const contacts = await getContacts();
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getOneContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await getOneContact(contactId);
  if (contact === null) {
    return next(createHttpError(404, 'Contact not found.'));
  }
  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}

export async function createNewContactController(req, res, next) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const response = await createContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: response,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId);
  if (deleted === null) {
    return next(createHttpError(404, 'Contact not found.'));
  }
  res.status(204).send();
}
