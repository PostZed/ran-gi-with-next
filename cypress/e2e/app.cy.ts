

// Prevent TypeScript from reading file as legacy script
export { };

describe("Use check board button.", () => {

    it("Displays a message saying the board is not filled.", () => {
        cy.visit("http://localhost:3000");
        cy.get("#check-board", { timeout: 10000 }).click();
        cy.get("#verifying").contains("Checking your board...");
        cy.wait(3000)
        cy.get("#verify-result").contains("You have not completed the puzzle.")
    });
})