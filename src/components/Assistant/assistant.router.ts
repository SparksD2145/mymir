import {Router, Request, Response, NextFunction} from 'express';
import * as basicAuth from 'express-basic-auth';
import {BasicAuthConfig} from '../../config/config.default';

import ContactsController from '../Contacts/contacts.controller';
import {AssistantRequest, AssistantResponse} from "./assistant.types";
import {
  CountContactsAction, CreateContactAction, DeleteAllContactsAction,
  DeleteContactAction, ReadContactAction, ReadMultiContactByNameAction, UnknownAction, UpdateContactAction
} from "./assistant.actions";
import {Contact, ContactFlexible} from "../Contacts/contacts.types";

let getDataSource = function (req: Request): AssistantRequest {
  if (req.method === 'GET') return req.query;
  else if (req.method === 'POST') return req.body;
};

export class AssistantRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private static sendResponse (
    res:Response,
    status:number,
    message:string
  ): AssistantResponse {
    const reply = {
      speech: message,
      displayText: message
    };

    res.status(status).send(reply);
    return reply;
  }

  public static act(req: Request, res: Response, next: NextFunction) {
    const data = getDataSource(req);
    const contactData = data.result.parameters;

    const contact:ContactFlexible = {
      name: contactData['given-name'] + ' ' + contactData['last-name'],
      phone: contactData['phone-number'] || null,
      email: contactData.email || null,
      address: contactData.address || null,
      field: contactData.field || null
    };

    const action = data.result.action;
    const confirmation = contactData.confirmation || 'false';

    if (action === CreateContactAction) {
      AssistantRouter.add(contact, res);

    } else if (action === ReadMultiContactByNameAction) {
      AssistantRouter.getNames(res);

    } else if (action === ReadContactAction) {
      AssistantRouter.getContactInfo(contact, res);

    } else if (action === UpdateContactAction) {
      AssistantRouter.update(contact, res);

    } else if (action === DeleteContactAction) {
      AssistantRouter.remove(contact, confirmation, res);

    } else if (action === DeleteAllContactsAction) {
      AssistantRouter.removeAll(confirmation, res);

    } else if (action === CountContactsAction) {
      AssistantRouter.getCount(res);

    } else if (action === UnknownAction) {
      AssistantRouter.UnknownAction(res);
    }
  }

  public static getContactInfo (lookupContact: ContactFlexible, res:Response) {
    ContactsController.getContactByName(lookupContact.name).then(
      contact => {
        if (!contact) { return AssistantRouter.sendResponse(res, 404, 'I couldn\'t find a contact by that name.'); }

        let field = lookupContact.field;

        if (contact[field]) {
          return AssistantRouter.sendResponse(res, 200, `${lookupContact.name}'s ${field} is ${contact[field]}.`);

        } else {
          return AssistantRouter.sendResponse(res, 200, `${lookupContact.name} does not have a valid ${field} assigned.`)
        }
      });
  }

  public static add (contact: Contact, res:Response) {
    ContactsController.add(contact)
      .then(() =>
        AssistantRouter.sendResponse(res, 201, `Great, I\'ve added ${contact.name} to your contacts.`)
      , err =>
        AssistantRouter.sendResponse(res, 500, err)
    );
  }

  public static getNames(res: Response) {
    ContactsController.getAllNames()
      .then(names => {
        if (names.length > 0) {
          const allNames = names.join(', ');
          AssistantRouter.sendResponse(res, 200, `The following names are in your contacts: ${allNames}`);
        } else {
          AssistantRouter.sendResponse(res, 200, `There are no contacts in your contact book.`);
        }

      }, err => AssistantRouter.sendResponse(res, 500, err));
  }

  public static remove (contact, confirmation:string, res:Response) {
    if (confirmation !== 'true') {
      AssistantRouter.sendResponse(res, 200, `Okay, we\'ll hold onto ${contact.name} for now.`);
      return;
    }

    ContactsController.getContactByName(contact.name).then(contact => {
      if (!contact) { return AssistantRouter.sendResponse(res, 404, `I couldn't find a contact by that name.`)}

      ContactsController.remove(contact).then(
        () => AssistantRouter.sendResponse(res, 200, 'Contact Removed.'),
        err => AssistantRouter.sendResponse(res, 500, err)
      );
    }, err => AssistantRouter.sendResponse(res, 500, err));
  }

  public static removeAll (confirmation:string, res:Response) {
    if (confirmation !== 'true') {
      AssistantRouter.sendResponse(res, 200, 'You\'ve got it, I\'ll hold onto your contacts for you.');
      return;
    }

    ContactsController.removeAll().then(
      () => AssistantRouter.sendResponse(res, 200, 'Contacts Removed.'),
      err => AssistantRouter.sendResponse(res, 500, err)
    );
  }

  public static update (updates: ContactFlexible, res: Response) {
      ContactsController.getContactByName(updates.name).then(
        (contact) => {
          ContactsController.update(contact, updates).then(
            () => AssistantRouter.sendResponse(res, 200, `Okay, I've updated ${updates.name}'s ${updates.field} for you.`),
            err => AssistantRouter.sendResponse(res, 500, err)
          );
        }
      );
  }

  public static getCount(res: Response) {
    ContactsController.count()
      .then(count => {
        AssistantRouter.sendResponse(res, 200, `I'm currently tracking ${count} contacts.`);
      }, err => AssistantRouter.sendResponse(res, 500, err));
  }

  public static UnknownAction (res:Response) {
    AssistantRouter.sendResponse(res, 200, 'I\'m not sure how to help with that.');
  }

  init() {
    this.router.use(basicAuth(BasicAuthConfig));

    this.router.get('/', AssistantRouter.act);
    this.router.post('/', AssistantRouter.act);
  }

}

// Create the AssistantRouter, and export its configured Express.Router
const assistantRoutes = new AssistantRouter();
assistantRoutes.init();

export default assistantRoutes.router;
