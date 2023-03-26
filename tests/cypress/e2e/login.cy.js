describe('Login', () => {
    it('Logs in with valid credentials', () => {
      cy.visit('/login');
  
      // Fill out email and password inputs
      cy.get('#email').type('TestAccount@HonkedIn.com');
      cy.get('#password').type('password');
  
      // Submit the forms
      cy.get('form').submit();
  
      // Ensure user is redirected to homepage after login
      cy.url({timeout: 10000}).should('eq', 'http://localhost:3000/');
    });
  
    it('Displays error message with invalid credentials', () => {
      cy.visit('/login');
  
      // Fill out email and password inputs with invalid credentials
      cy.get('#email').type('invalid@example.com');
      cy.get('#password').type('invalid-password');
  
      // Submit the form
      cy.get('form').submit();
  
      // Ensure error message is displayed
      cy.get('.chakra-alert').should('be.visible');
    });
  
    it('Navigates to forgot password page', () => {
      cy.visit('/login');
  
      // Click the "Forgot Password?" link
      cy.contains('Forgot Password?').click();
  
      // Ensure user is redirected to the correct page
      cy.url().should('eq', 'http://localhost:3000/forgot-password');
    });
  
    it('Navigates to signup page', () => {
      cy.visit('/login');
  
      // Click the "Sign Up" link
      cy.contains('Sign Up').click();
  
      // Ensure user is redirected to the correct page
      cy.url().should('eq', 'http://localhost:3000/signup');
    });
  });