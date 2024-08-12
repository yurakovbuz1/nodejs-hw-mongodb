import express from "express";
import { getContactsController, getOneContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", ctrlWrapper(getOneContactController));

export default router;
