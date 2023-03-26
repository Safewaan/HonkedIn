describe('Create Resource', () => {
    it('Creates a valid resource', () => {
        //logs in
        cy.visit('/login');
        cy.get('#email').type('TestAccount@HonkedIn.com');
        cy.get('#password').type('password');
        cy.get('form').submit();

        //visits the create resource page
        cy.visit('/create-resource');

        // Fill out title, link, and tag
        cy.get('#title').type('How to write an E2E test');
        cy.get('#link').type('https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test');
        cy.get('#MediaTagList').select('School');

        cy.get('form').submit();

        cy.get('#title').should('be.empty');
        cy.get('#link').should('be.empty');
        cy.get('#MediaTagList').should('have.value', '');


    })

})