import { ContactsCollection } from '../db/models/contacts.js';

export function getContacts() {
  return ContactsCollection.find();
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
