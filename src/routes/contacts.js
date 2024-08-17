import express from 'express';
import {
  getContactsController,
  getOneContactController,
  createNewContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactsSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getOneContactController));

router.post(
  '/',
  jsonParser,
  validateBody(contactsSchema),
  ctrlWrapper(createNewContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  jsonParser,
  validateBody(contactsSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
