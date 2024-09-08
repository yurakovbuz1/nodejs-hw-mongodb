import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContacts,
  getOneContact,
  patchContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getContactsController(req, res, next) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getOneContactController(req, res, next) {
  const { userId } = req.user._id;
  const { contactId } = req.params;

  const contact = await getOneContact(contactId, userId);

  if (contact === null) {
    return next(createHttpError(404, 'Contact not found.'));
  }

  if (contact.userId.toString() !== req.user._id) {
    return next(createHttpError(401, 'Student not allowed'));
  }

  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}

export async function createNewContactController(req, res, next) {
  const contact = {
    userId: req.user._id,
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

export async function patchContactController(req, res, next) {
  const { userId } = req.user._id;
  const { contactId } = req.params;
  const payload = req.body;
  const patchedContact = await patchContact(contactId, userId, payload);
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: patchedContact,
  });
}

export async function deleteContactController(req, res, next) {
  const { userId } = req.user._id;
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId, userId);
  if (deleted === null) {
    return next(createHttpError(404, 'Contact not found.'));
  }
  res.status(204).send();
}
