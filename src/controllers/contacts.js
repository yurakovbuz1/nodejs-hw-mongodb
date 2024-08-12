import {getContacts, getOneContact} from '../services/contacts.js';

export async function getContactsController(req, res, next) {
    const contacts = await getContacts();
    res.send({ status: 200, message: "Successfully found contacts!", data: contacts });
    // } catch (error) {
    //     res.status(500).send({ status: 500, message: "Internal Server Error:", error });
    // }
};

export async function getOneContactController(req, res, next) {
    const { contactId } = req.params;
    const contact = await getOneContact(contactId);
    if (contact === null) {
        return res.status(404).send({ message: "Contact not found" });
    }
    res.send({ status: 200, message: `Successfully found contact with id ${contactId}`, data: contact });
    // } catch (error) {
    //     res.status(500).send({ status: 500, message: "Internal Server Error", error });
    // }
};
