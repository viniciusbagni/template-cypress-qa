Cypress.Commands.add('authLogin', (email, password) => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl'),
    headers: {
      username: email,
      password: password,
    },
    failOnStatusCode: false
  }).then((response) => {
    globalThis.token = response.body.data.token.accessToken
  })
})