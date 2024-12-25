// // test/School.manager.test.js
// const { expect } = require('chai');
// const sinon = require('sinon');
// const School = require('../School.manager.js');

// describe('School Manager Tests', () => {
//   let schoolManager;           // Our School instance under test
//   let stubbedCrud;             // Will hold our CRUD method stubs
//   let stubbedValidators;       // Will hold validator stubs
  
//   beforeEach(() => {
//     // Create stubbed methods for CRUD
//     stubbedCrud = {
//       create: sinon.stub(),
//       read: sinon.stub(),
//       update: sinon.stub(),
//       delete: sinon.stub()
//     };
    
//     // Create stubbed validators
//     stubbedValidators = {
//       school: {
//         create: sinon.stub()
//       }
//     };
    
//     // Mock managers, mongoDB, etc.
//     const mockManagers = {
//       token: {} // or any other managers needed
//     };
    
//     const mockMongoDB = {
//       CRUD: () => stubbedCrud
//     };
    
//     // Instantiate our School class with stubs
//     schoolManager = new School({
//       config: {},
//       cortex: {},
//       validators: stubbedValidators,
//       managers: mockManagers,
//       mongomodels: { school: {} },
//       mongoDB: mockMongoDB
//     });
//   });
  
//   afterEach(() => {
//     sinon.restore(); // reset stubs/spies
//   });
  
//   // ------------------------------------------------------------------
//   // CREATE
//   // ------------------------------------------------------------------
//   describe('create()', () => {
//     it('should create a new school successfully', async () => {
//       // Arrange
//       const input = { name: 'Test School', address: '123 Main St', url: 'http://test.edu' };
//       // Validator returns null/undefined => no errors
//       stubbedValidators.school.create.resolves(null);
//       // CRUD create returns this object as "created"
//       stubbedCrud.create.resolves({
//         name: 'Test School',
//         address: '123 Main St',
//         url: 'http://test.edu'
//       });
      
//       // Act
//       const result = await schoolManager.create(input);
      
//       // Assert
//       expect(result).to.deep.equal({
//         name: 'Test School',
//         address: '123 Main St',
//         url: 'http://test.edu'
//       });
//       expect(stubbedValidators.school.create.calledOnceWithExactly(input)).to.be.true;
//       expect(stubbedCrud.create.calledOnceWithExactly(input)).to.be.true;
//     });
    
//     it('should return error if validator fails', async () => {
//       // Arrange
//       const input = { name: 'Bad School', address: '???', url: 'test' };
//       // Simulate validator returning an error array
//       stubbedValidators.school.create.resolves([{ message: 'Invalid data' }]);
      
//       // Act
//       const result = await schoolManager.create(input);
      
//       // Assert
//       expect(result).to.deep.equal({ error: 'Invalid data', statusCode: 400 });
//       expect(stubbedCrud.create.notCalled).to.be.true; // should NOT call DB if validation fails
//     });
//   });
  
//   // ------------------------------------------------------------------
//   // READ
//   // ------------------------------------------------------------------
//   describe('read()', () => {
//     it('should read a school by context (name)', async () => {
//       // Arrange
//       const fakeSchool = {
//         _id: '123',
//         name: 'My School',
//         address: 'ABC Road',
//         url: 'http://myschool.edu'
//       };
      
//       stubbedCrud.read.resolves([fakeSchool]);
      
//       // Act
//       const result = await schoolManager.read({ context: 'My School' });
      
//       // Assert
//       expect(result).to.deep.equal({
//         name: 'My School',
//         address: 'ABC Road',
//         url: 'http://myschool.edu'
//       });
//       expect(stubbedCrud.read.calledOnceWithExactly({ name: 'My School' })).to.be.true;
//     });
    
//     it('should return error if no school is found', async () => {
//       // Arrange
//       stubbedCrud.read.resolves([]); // no results
      
//       // Act
//       const result = await schoolManager.read({ context: 'Nonexistent' });
      
//       // Assert
//       expect(result).to.deep.equal({
//         error: 'no schools were found by the given name',
//         statusCode: 400
//       });
//     });
//   });
  
//   // ------------------------------------------------------------------
//   // UPDATE
//   // ------------------------------------------------------------------
//   describe('update()', () => {
//     it('should update a school with new address/url', async () => {
//       // Arrange
//       const existingSchool = {
//         _id: '123',
//         name: 'Old Name',
//         address: 'Old Address',
//         url: 'http://old.url'
//       };
//       stubbedCrud.read.resolves([existingSchool]);
//       stubbedCrud.update.resolves({
//         _id: '123',
//         name: 'Old Name',
//         address: 'New Address',
//         url: 'http://new.url'
//       });
      
//       // Act
//       const result = await schoolManager.update({
//         name: 'Old Name',
//         address: 'New Address',
//         url: 'http://new.url'
//       });
      
//       // Assert
//       expect(result).to.deep.equal({
//         name: 'Old Name',
//         address: 'New Address',
//         url: 'http://new.url'
//       });
//       // read is called with {name} to find existing
//       expect(stubbedCrud.read.calledOnceWithExactly({ name: 'Old Name' })).to.be.true;
//       // update is called with correct ID & data
//       expect(stubbedCrud.update.calledOnceWithExactly('123', {
//         address: 'New Address',
//         url: 'http://new.url'
//       })).to.be.true;
//     });
    
//     it('should return error if no matching school for update is found', async () => {
//       // Arrange
//       stubbedCrud.read.resolves([]); // no match
//       // Act
//       const result = await schoolManager.update({ name: 'Missing' });
//       // Assert
//       expect(result).to.deep.equal({
//         message: 'no schools were found by the given name',
//         statusCode: 400
//       });
//       expect(stubbedCrud.update.notCalled).to.be.true;
//     });
//   });
  
//   // ------------------------------------------------------------------
//   // DELETE
//   // ------------------------------------------------------------------
//   describe('delete()', () => {
//     it('should delete a school by name (context)', async () => {
//       // Arrange
//       const existingSchool = {
//         _id: '123',
//         name: 'Some School',
//         address: 'Some Address',
//         url: 'http://some.url'
//       };
      
//       stubbedCrud.read.resolves([existingSchool]);
//       stubbedCrud.delete.resolves(existingSchool);
      
//       // Act
//       const result = await schoolManager.delete({ context: 'Some School' });
      
//       // Assert
//       expect(result).to.deep.equal({
//         name: 'Some School',
//         address: 'Some Address',
//         url: 'http://some.url'
//       });
//       expect(stubbedCrud.read.calledOnceWithExactly({ name: 'Some School' })).to.be.true;
//       expect(stubbedCrud.delete.calledOnceWithExactly('123')).to.be.true;
//     });
    
//     it('should return error if no school found to delete', async () => {
//       // Arrange
//       stubbedCrud.read.resolves([]);
//       // Act
//       const result = await schoolManager.delete({ context: 'NotFound' });
//       // Assert
//       expect(result).to.deep.equal({
//         error: 'no schools were found by the given name',
//         statusCode: 400
//       });
//       expect(stubbedCrud.delete.notCalled).to.be.true;
//     });
//   });
// });
