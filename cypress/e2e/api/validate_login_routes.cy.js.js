describe('Validate Login Routes', () => {

  it('returning status success for authentication', () => {
    let email = Cypress.config('email')
    let password = Cypress.config('password')
    cy.authLogin(email, password).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.statusText).to.eq('OK')
      expect(response.body.data.token.accessToken).not.null
      expect(response.body.data.token.expires).not.null
      expect(response.body.data.token.refreshToken).not.null
      expect(response.body.data.user.login).eq(password)
      expect(response.body.data.user.loginUser.tokenSystem).eq(client_id)
    })
  })
})