
describe('Cypress', () => {
    it('is working', () => {
      expect(true).to.equal(true)
    });

    it('Testing get request',()=>{
        cy.request("http://localhost:8084")
        .then((response)=>{
            expect(response.status).to.eq(201)
        })
    })
  })