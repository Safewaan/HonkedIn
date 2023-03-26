describe('Create Resource', () => {

    //logs in so that can access private routes if opening test for first time
    const login = () => {
        cy.visit('/login');
        cy.get('#email').type('TestAccount@HonkedIn.com');
        cy.get('#password').type('password');
        cy.get('form').submit();
    }

     it('Creates a valid resource', () => {
         login; 
         //visits the create resource page
         cy.visit('/create-resource');
 
         // Fill out title, link, and tag
         cy.get('#title').type('How to write an E2E test');
         cy.get('#link').type('https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test');
         cy.get('#MediaTagList').select('School');
 
         cy.intercept('POST', [
             {creatorID: 0, resourcesTitle: '', 
             resourcesLink: '',
             mediaTag: ''} 
         ]);
 
         cy.get('form').submit();
 
         cy.get('#title').should('be.empty');
         cy.get('#link').should('be.empty');
         cy.get('#MediaTagList').should('have.value', '');
     }) 

    it('requires link to be filled for valid resource creation', () => {

        cy.visit('/create-resource');

        // Fill out only title
        cy.get('#title').type('How to write an E2E test');
        cy.get('#MediaTagList').select('School');

        cy.get('form').submit();

        // The success alert should not exist on the page 
        cy.get('.chakra-alert').should('not.exist');

    })

    it('has dropdown list for resource media tag', () => {

        cy.visit('/create-resource');

        //each option should be able to be chosen from the drop down 
        cy.get('#MediaTagList').select('');
        cy.get('#MediaTagList').select('Interview Tips');
        cy.get('#MediaTagList').select('Youtube');
        cy.get('#MediaTagList').select('Stack Overflow');
        cy.get('#MediaTagList').select('School');
        cy.get('#MediaTagList').select('Personal Website');
        cy.get('#MediaTagList').select('Spreadsheet');
    })

    it('posts valid resources so that they can be seen on the My Resources page', () => {
        //visits the create resource page
        cy.visit('/my-resources');
        cy.contains('How to write an E2E test');
        cy.contains('https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test');
        cy.contains('School');
    })

})