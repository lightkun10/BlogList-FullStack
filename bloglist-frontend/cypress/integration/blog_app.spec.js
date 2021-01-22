describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    // const user = {
    //   name: 'testname',
    //   username: 'testusername',
    //   password: 'testpassword',
    // }
    // cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000/');
  });

  it('Login form is shown', function() {
    cy.contains('Log in to application');
    cy.get('.login__form').as('loginForm');
    cy.get('@loginForm').should('contain', 'username');
    cy.get('@loginForm').should('contain', 'password');
  });
});