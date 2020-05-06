const { setup: setupDevServer } = require('jest-dev-server')
const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup(globalConfig) {
    await setupPuppeteer(globalConfig)
    await setupDevServer({
        command: `npx http-server ./src -a 127.0.0.1 -p 3000`,
        launchTimeout: 50000,
        port: 3000,
        usedPortAction: 'kill',
    })
}