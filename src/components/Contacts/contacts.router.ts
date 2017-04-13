import {Router, Request, Response, NextFunction} from 'express';
import ContactsController from './contacts.controller';
import {Contact, ContactsResponse} from "./contacts.types";

let getDataSource = function (req: Request) {
  if (req.method === 'GET') return req.query;
  else if (req.method === 'POST') return req.body;
  else return {};
};

export class ContactsRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private static sendResponse (
    res:Response,
    status:number,
    message:string,
    contacts?:Contact[]
  ): ContactsResponse {
    let response = {
      status: status,
      message: message,
      contacts: []
    };

    if (!contacts) {
      delete response.contacts;
    } else {
      response.contacts = contacts;
    }

    res.status(status).send(response);
    return response;
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    ContactsController.getAll()
      .then(
        contacts =>
          ContactsRouter.sendResponse(res, 200, 'Successfully retrieved contacts.', contacts)
        , err =>
          ContactsRouter.sendResponse(res, 500, err)
      );
  }

  public getAllNames(req: Request, res: Response, next: NextFunction) {
    ContactsController.getAllNames()
      .then(
        names => ContactsRouter.sendResponse(res, 200, 'Successfully retrieved contacts.', names)
        , err =>
          ContactsRouter.sendResponse(res, 500, err)
      );
  }

  public getOne (req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) { return ContactsRouter.sendResponse(res, 400, 'No contact id provided.'); }

    let query = req.params.id;

    ContactsController.getContactById(query)
      .then(
        contact => {
          if (!contact) {
            return ContactsRouter.sendResponse(res, 404, 'No Contact found.');
          }

          ContactsRouter.sendResponse(res, 200, 'Successfully retrieved contact.', [contact]);
        }, err =>
          ContactsRouter.sendResponse(res, 500, err)
      );
  }

  public add (req: Request, res: Response, next: NextFunction) {
    let newContact = getDataSource(req);

    ContactsController.add(newContact)
      .then(() =>
        ContactsRouter.sendResponse(res, 201, 'Contact created successfully.')
      , err =>
        ContactsRouter.sendResponse(res, 500, err)
    );
  }

  public remove (req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) { return ContactsRouter.sendResponse(res, 400, 'No contact id provided.'); }

    let query = req.params.id;
    ContactsController.getContactById(query).then(contact => {
      if (!contact) { return ContactsRouter.sendResponse(res, 404, 'No contact found.')}

      ContactsController.remove(contact).then(
        () => ContactsRouter.sendResponse(res, 200, 'Contact Removed.'),
        err => ContactsRouter.sendResponse(res, 500, err)
      );
    }, err => ContactsRouter.sendResponse(res, 500, err));
  }

  public getCount(req: Request, res: Response, next: NextFunction) {
    ContactsController.count()
      .then(count => {
        res
          .status(200)
          .send({
            count: count
          });
      }, err => {
        res
          .status(500)
          .send({
            message: err,
            status: res.status
          });
      });
  }

  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.getAll);

    this.router.use('/names', this.getAllNames);

    this.router.get('/details/:id', this.getOne);
    this.router.post('/details/:id', this.getOne);

    this.router.get('/add/', this.add);
    this.router.post('/add/', this.add);

    this.router.get('/delete/:id', this.remove);
    this.router.post('/delete/:id', this.remove);

    this.router.get('/count/', this.getCount);
    this.router.post('/count/', this.getCount);
  }

}

// Create the ContactsRouter, and export its configured Express.Router
const contactRoutes = new ContactsRouter();
contactRoutes.init();

export default contactRoutes.router;
