import express from 'express';
import {
  getContactsController,
  getOneContactController,
  createNewContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getOneContactController));

router.post('/', jsonParser, ctrlWrapper(createNewContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
