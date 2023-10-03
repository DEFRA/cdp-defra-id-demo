import Page from '~/user-journey-tests/page-objects/page'

describe('Home Page', () => {
  it('Should display expected page heading', async () => {
    await browser.url('')
    await expect(Page.headingTitle).toBeExisting()
    await expect(Page.headingTitle).toHaveText('Home')
  })
})
