describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'testname',
      username: 'testusername',
      password: 'testpassword',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000/');
  });

  it('Login form is shown', function() {
    cy.contains('Log in to application');
    cy.get('.login__form').as('loginForm');
    cy.get('@loginForm').should('contain', 'username');
    cy.get('@loginForm').should('contain', 'password');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('.login__form').as('loginForm');
      cy.get('#username').type('testusername');
      cy.get('#password').type('testpassword');
      cy.get('@loginForm').get('.login__form__submit').click();

      cy.contains('testname logged in');
    });

    it('fails with wrong credentials', function() {
      cy.get('.login__form').as('loginForm');
      cy.get('#username').type('wrong');
      cy.get('#password').type('wrong');
      cy.get('@loginForm').get('.login__form__submit').click();

      // Check that the notification shown with 
      // unsuccessful login is displayed red.
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');
      cy.get('html').should('not.contain', 'testname logged in');
    });
  });

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testusername', password: 'testpassword' });
    });

    it('A blog can be created', function() {
      cy.contains('new blog').click();

      cy.get('.blog__addform__form').as('newBlogForm');
      cy.get('@newBlogForm').get('#title').type('test title');
      cy.get('@newBlogForm').get('#author').type('test author');
      cy.get('@newBlogForm').get('#url').type('https://www.google.com/');
      cy.get('.blog__addform__form__submit').click();
      cy.get('.blog__entry__content__title').contains('test title');
    });
  })
});