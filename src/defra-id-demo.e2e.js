import { browser, expect, $ } from '@wdio/globals'

import { createServer } from '~/src/server'
import fetch from 'node-fetch'
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()

const user = {
  userId: '86a7607c-a1e7-41e5-a0b6-a41680d05a2a',
  email: 'some@example.com',
  firstName: 'Test',
  lastName: 'User',
  loa: '1',
  aal: '1',
  enrolmentCount: 1,
  enrolmentRequestCount: 1,
  relationships: [
    {
      organisationName: 'Some Org',
      relationshipRole: 'Employee',
      roleName: 'Some role',
      roleStatus: '1'
    }
  ]
}

describe('cdp-defra-id-demo', async () => {
  let server

  // eslint-disable-next-line no-undef
  before(async () => {
    if (server === undefined) {
      server = await createServer()
    }
    logger.info('Starting service')
    await server.initialize()
    await server.start()
    logger.info('Service started')
  })

  // eslint-disable-next-line no-undef
  after(async () => {
    logger.info('stopping service')
    await server.stop({ timeout: 4000 })
    logger.info('server stopped')
  })

  it('Login using API created user', async () => {
    const apiResult = await fetch(
      'http://localhost:3200/cdp-defra-id-stub/API/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
    )

    expect(apiResult.status).toEqual(201)

    await browser.url('/')

    const title = await $(`[data-testid="app-heading-title"]`)
    await expect(title).toHaveText('Home')

    // Click login
    const loginLink = await $('#login-link')
    await expect(loginLink).toHaveText('here')
    await loginLink.click()

    // Select profile and login
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
    const profileLink = await $('=Log in')
    await expect(profileLink).toExist()
    await profileLink.click()

    // Check we're logged in
    await expect($('strong=Test User')).toExist()
    await expect($('code=some@example.com')).toExist()

    // Log out
    await $('=Sign out').click()
    const titleAfterSignOut = await $(`[data-testid="app-heading-title"]`)
    await expect(titleAfterSignOut).toHaveText('Home')
    await expect($('strong=Test User')).not.toExist()
  })
})
