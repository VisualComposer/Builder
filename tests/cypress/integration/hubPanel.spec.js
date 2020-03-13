/* global Cypress, describe, it, cy */

describe('Hub Panel', function () {
  it('Opens Hub panel, downloads element, adds element', function () {
    cy.fixture('../fixtures/hubPanel.json').then((settings) => {
      const checkItemsExistence = () => {
        cy.get('.vcv-ui-item-list')
          .first()
          .find('.vcv-ui-item-list-item')
          .its('length')
          .should('not.be.eq', 0)
      }

      cy.viewport(1100, 700)
      cy.createPage()

      // Click on Hub control, check banner exists, check items exists, close Hub panel
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      cy.get('.vcv-layout-bar-content.vcv-ui-state--visible #vcv-editor-end')
      cy.get('.vcv-hub-banner-content')
        .contains('Get More Elements, Templates, and Extensions')
      cy.contains('.vcv-hub-banner-button', 'Go Premium')
        .should('have.attr', 'data-href', `${Cypress.env('baseUrl')}wp-admin/admin.php?page=vcv-getting-started&vcv-ref=hub-banner&screen=license-options`)
      cy.contains('.vcv-ui-form-button.vcv-ui-form-button--active', 'All')
      checkItemsExistence()
      cy.get('.vcv-layout-bar-content-hide[title="Close"]').click()

      // Click on tabs, check items existence
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      settings.tabs.forEach((tab) => {
        cy.contains('.vcv-ui-form-button', tab).click()
        checkItemsExistence()
      })

      // Click on Stock Images tab, click on image
      cy.contains('.vcv-ui-form-button', 'Stock Images').click()
      cy.wait(1500) // Need to wait for images to load before performing any assertions
      cy.contains('.vcv-stock-images-button', 'Activate Premium')
      cy.get('.vcv-stock-image-wrapper.vcv-stock-image--loaded')
        .first()
        .find('.vcv-stock-image-hover-download .vcv-ui-icon-lock')

      // Click on Elements tab, check elements exist, check premium elements are locked
      cy.contains('.vcv-ui-form-button', 'Elements').click()
      checkItemsExistence()
      cy.contains('.vcv-ui-item-element.vcv-ui-item-element-inactive', settings.premiumElementName)
        .find('.vcv-ui-icon-lock')

      // Search for Free element, download element, add element
      cy.get('#add-element-search')
        .type(settings.freeElementName)
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-item-list-item')
        .its('length')
        .should('be.eq', 1)
      cy.window().then((window) => {
        cy.route('POST', window.vcvAdminAjaxUrl).as('downloadItem')
      })
      cy.contains('.vcv-ui-item-element', settings.freeElementName)
        .find('.vcv-ui-icon-download')
        .click()
      cy.get('.vcv-ui-wp-spinner-light')
      cy.wait('@downloadItem')
      cy.savePage()
      cy.reload()
      // cy.wait(2000) // Hardcode wait to ensure that element is downloaded

      // Open Add Element check downloaded element's existence, add element to the page
      cy.addElement(settings.freeElementName)
      cy.setClassAndId(settings.customId, settings.customClass)

      // Click on Templates tab, check elements exist, check premium elements are locked
      cy.get('.vcv-ui-navbar-control[title="Hub"]').click()
      cy.contains('.vcv-ui-form-button', 'Templates').click()
      checkItemsExistence()
      cy.contains('.vcv-ui-item-element.vcv-ui-item-element-inactive', settings.premiumTemplateName)
        .find('.vcv-ui-icon-lock')

      // Search for Free template, download template, add template
      cy.get('#add-element-search')
        .type(settings.freeTemplateName)
      cy.get('.vcv-ui-item-list')
        .first()
        .find('.vcv-ui-item-list-item')
        .its('length')
        .should('be.eq', 1)

      cy.contains('.vcv-ui-item-element', settings.freeTemplateName)
        .find('.vcv-ui-icon-download')
        .click()
      cy.get('.vcv-ui-wp-spinner-light')
      cy.wait('@downloadItem')

      // Open Add Template check downloaded template's existence, add template to the page
      cy.get('.vcv-ui-navbar-control[title="Add Template"]').click()
      cy.contains('.vcv-ui-item-element', settings.freeTemplateName)
        .click()

      cy.savePage()
      cy.viewPage()

      cy.get(`#${settings.customId}`)
        .should('have.class', settings.customClass)
        .find('p')
        .contains(settings.rawHtmlText)

      cy.contains('h1 span', 'Iceland')
      cy.contains('h2 span', 'Best place of Iceland')
      cy.contains('p', 'Tourism is  financing funding Iceland hackathon accelerator long tail infographic influencer innovator travelers buzzing that land.')
      cy.contains('.vce-button--style-basic', 'Book Your Seat')
      cy.contains('.vce-button--style-basic', 'Explore Iceland')

    })
  })
})
