const faker = require('faker-br')

export function generateCEP() {
    return faker.address.zipCode()
}