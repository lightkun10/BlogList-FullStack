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

    describe('and current user added blogs', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'first blog',
          author: 'first author',
          url: 'first url'
        });
        cy.createBlog({
          title: 'second blog',
          author: 'second author',
          url: 'second url'
        });
      })

      it('it can be liked', function() {
        cy.contains('second blog')
          .parent()
          .get('#detailButton')
          .click();
        
        cy.contains('second blog')
          .parent()
          .get('.blog__entry__content__detail__likes__button')
          .click();
        cy.contains('second blog')
          .parent()
          .get('.blog__entry__content__detail__likes')
          .should('contain', 'likes 1');
      });

      it('it can be deleted', function() {
        cy.contains('first blog').as('testfirstBlog');
        
        cy.get('@testfirstBlog')
          .parent()
          .get('.blog__entry__button__toggledetail')
          .get('#detailButton')
          .click();

        cy.get('@testfirstBlog')
          .parent()
          .get('.blog__entry__content__detail__deletebutton')
          .get('#deleteButton')
          .click();
        cy.on('window:confirm', () => true);
        cy.get('@testfirstBlog').should('not.exist');
      })

      describe('another user logged in', function() {
        beforeEach(function() {
          // cy.request('POST', 'http://localhost:3003/api/testing/reset');
          const user2 = {
            name: 'testname2',
            username: 'testusername2',
            password: 'testpassword2',
          }
          cy.request('POST', 'http://localhost:3003/api/users', user2);
          cy.login({ username: 'testusername2', password: 'testpassword2' });
        });

        it('cannot delete blog not created by them', function() {
          cy.contains('first blog').as('testfirstBlog');

          cy.get('@testfirstBlog')
          .parent()
          .get('.blog__entry__button__toggledetail')
          .get('#detailButton')
          .click();

          cy.get('@testfirstBlog')
          .parent()
          .get('.blog__entry__content__detail__deletebutton')
          .get('#deleteButton')
          .should('not.exist');
        })
      })
    });

    describe('and there are multiple blogs available', function() {
      // Make three different blog
      beforeEach(function() {
        for(let i = 0; i < 3; i++) {
          cy.createBlog({
            title: `test blog ${i}`,
            author: `test author ${i}`,
            url: `test url ${i}`,
            likes: `${i}`
          });
        }
        cy.visit('http://localhost:3000');
      });

      // Add like some
      it('that is sorted by likes count', function() {
        // click all blog content
        cy.get('.blog__entry__content').each($div => {
          cy.wrap($div).contains('view').click();
        });

        // ensure that all div is 3
        cy.get('.blog__entry__content').then($divs => {
          expect($divs).to.have.length(3);
        })

        // save all likes of each blog
        let likes = $divs.map((i, el) => {
          return Cypress.$(el).find('.likesAmount').text();
        });
        // convert jquery object into array
        expect(likes.get()).to.deep.eq(['2', '1', '0']);
      })
    });
  })
});