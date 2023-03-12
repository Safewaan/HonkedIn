const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: "tests/cypress/e2e/*.cy.js",
        supportFile: "tests/cypress/support/e2e.js",
    },
});