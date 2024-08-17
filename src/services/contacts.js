import { ContactsCollection } from '../db/models/contacts.js';

export async function getContacts({ page, perPage, sortBy, sortOrder }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [count, contacts] = await Promise.all([
    ContactsCollection.countDocuments(),
    ContactsCollection.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = totalPages - page > 0;

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}

export function getOneContact(contactId) {
  return ContactsCollection.findById(contactId);
}

export function createContact(payload) {
  return ContactsCollection.create(payload);
}

export function deleteContact(contactId) {
  return ContactsCollection.findByIdAndDelete(contactId);
}

export function patchContact(contactId, payload) {
  return ContactsCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
}
