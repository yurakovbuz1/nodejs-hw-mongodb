import { ContactsCollection } from '../db/models/contacts.js';

export async function getContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find();

  if (typeof filter.contactType !== 'undefined') {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactsQuery.where('userId').equals(userId);

  const [count, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery),
    contactsQuery
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

export function getOneContact(contactId, userId) {
  return ContactsCollection.findOne({ _id: contactId, userId });
}

export function createContact(payload) {
  return ContactsCollection.create(payload);
}

export function deleteContact(contactId, userId) {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
}

export function patchContact(contactId, userId, payload) {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );
}
