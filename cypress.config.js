const { defineConfig } = require("cypress")
require("dotenv").config()

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json'
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
    },
    experimentalRunAllSpecs: true,
  },
  baseUrl: process.env.BASE_URL,
  email: process.env.USERNAME,
  password: process.env.PASSWORD,
  retries: 3
})