import * as Sequelize from 'sequelize';

export interface Contact {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface ContactFlexible extends Contact {
  field?: string;
}

export interface ContactInstance extends Sequelize.Instance<Contact>, Contact {}

export interface ContactModel extends Sequelize.Model<ContactInstance, Contact> {}

export interface RepositoryConfig {
  database: string;
  user: string;
  password?: string;
}

export interface Repository {
  init(forceSync:boolean):Promise<any>;
}

export interface ContactsResponse {
  message: string;
  status: number;
  contacts?: Contact[];
}
