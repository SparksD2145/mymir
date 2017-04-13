import * as chai from 'chai';
import * as ContactsController from './contacts.controller';

const expect = chai.expect;

describe('Controller: Contacts', () => {

  describe('Listing Contacts', () => {
    it('should retrieve all contacts', () => {

    });

    it('should retrieve a single contact', () => {

    });

    it('should retrieve a single contact by phone number', () => {});
    it('should retrieve a single contact by email address', () => {});
    it('should retrieve a single contact by street address', () => {});

    it('should retrieve a single contact\'s phone number', () => {});
    it('should retrieve a single contact\'s street address', () => {});
    it('should retrieve a single contact\'s email address', () => {});

    it('should allow to list all contacts by name', () => {});

    it('should retrieve a numeric count of all contacts', () => {

    });
  });

  describe('Adding Contacts', () => {
    it('should add a contact by full name', () => {

    });

    it('should not add a contact if either first or last name are missing', () => {

    });

    it('should allow a contact to be created with an email', () => {});
    it('should allow a contact to be created with a street address', () => {});
    it('should allow a contact to be created with a phone number', () => {});
    it('should allow a contact to be created with two or more fields', () => {});
  });

  describe('Editing Contacts', () => {
    it('should be able to edit a contact\'s first name', () => {});
    it('should be able to edit a contact\'s last name', () => {});
    it('should be able to edit a contact\'s email address', () => {});
    it('should be able to edit a contact\'s street address', () => {});
    it('should be able to edit a contact\'s phone number', () => {});

    it('should validate the input email', () => {});
    it('should validate the input phone number', () => {});
  });

  describe('Deleteing Contacts', () => {
    // By Name
    it('should allow a contact to be deleted by first and last name', () => {});
    it('should not allow a contact to be deleted if the first or last name are missing', () => {});

    // By field
    it('should allow a contact to be deleted by phone number', () => {});
    it('should allow a contact to be deleted by email address', () => {});
    it('should allow a contact to be deleted by street address', () => {});

    it('should respond if a contact is not found by field.', () => {

    });
  });

});
