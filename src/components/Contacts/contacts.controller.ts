import * as Sequelize from 'sequelize';
import * as uuid from "node-uuid";
import {
  Contact,
  ContactInstance,
  ContactModel,
  Repository,
  RepositoryConfig
} from './contacts.types';

import {DBConfig} from '../../config/config.default';

export class ContactsController implements Repository {
  Contacts: ContactModel;

  private db: Sequelize.Sequelize;
  private config:RepositoryConfig;

  constructor(config:RepositoryConfig) {
    this.config = config;
    this.db = new Sequelize(
      this.config.database,
      this.config.user,
      this.config.password, {
        dialect: 'sqlite',
        storage: './contacts.sqlite'
      });

    this.Contacts = this.db.define<ContactInstance, Contact>('Contact', {
      'id': {
        'type': Sequelize.UUID,
        'allowNull': false,
        'primaryKey': true
      },
      'name': {
        'type': Sequelize.STRING(128),
        "allowNull": false
      },
      'email': {
        'type': Sequelize.STRING(128),
        'allowNull': true,
        'unique': true,
        'validate': {
          'isEmail': true
        }
      },
      'address': {
        'type': Sequelize.STRING(256),
        'allowNull': true
      },
      'phone': {
        'type': Sequelize.STRING(16),
        'allowNull': true,
        'validate': {
          'isNumeric': true
        }
      }
    });
  }

  init (forceSync:boolean = false):Promise<any> {
    return this.db.sync({ force: forceSync, logging: true});
  }

  count ():Promise<any> {
    return this.Contacts.count();
  }

  add (contact: Contact):Promise<any> {
    return this.db.transaction((transaction: Sequelize.Transaction) => {
      let accountId = uuid.v4();

      return this.Contacts.create({
        id: accountId,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address
      }, {
        transaction: transaction
      });
    });
  }

  remove (contact: ContactInstance):Promise<undefined> {
    return contact.destroy();
  }

  removeAll ():Promise<undefined> {
    return this.Contacts.truncate();
  }

  update (contact: ContactInstance, updates: Contact):Promise<any> {
    for (let key in updates) {
      if (!updates[key]) { delete updates[key]; }
    }

    return contact.update(updates);
  }

  getContactById (id:string):Promise<any> {
    return this.Contacts.find({
      where: { id: id }
    });
  }

  getContactByName (name:string):Promise<any> {
    return this.Contacts.find({
      where: { name: name }
    });
  }

  getContactByEmail (email:string):Promise<any> {
    return this.Contacts.find({
      where: { email: email }
    });
  }

  getContactByPhone (phone:string):Promise<any> {
    return this.Contacts.find({
      where: { phone: phone }
    });
  }

  getAll ():Promise<any> {
    return this.Contacts.findAll();
  }

  getAllNames ():Promise<any> {
    return this.Contacts.findAll({
      attributes: ['name']
    }).then((names) => names.map((person) => person.name));
  }
}

let contacts = new ContactsController(DBConfig);
contacts.init();

export default contacts as ContactsController;
