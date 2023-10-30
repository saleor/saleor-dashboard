import { PRODUCT_DETAILS } from "../../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../../elements/catalog/products/products-list";
import { AVAILABLE_CHANNELS_FORM } from "../../../../elements/channels/available-channels-form";
import { BUTTON_SELECTORS } from "../../../../elements/shared/button-selectors";
import { addMetadataField } from "../metadataComponent";
import { editSeoSettings } from "../seoComponent";

const valueTrue = AVAILABLE_CHANNELS_FORM.radioButtonsValueTrue;
const valueFalse = AVAILABLE_CHANNELS_FORM.radioButtonsValueFalse;

export function updateProductIsAvailableForPurchase(isAvailableForPurchase) {
  const isAvailableForPurchaseSelector = isAvailableForPurchase
    ? valueTrue
    : valueFalse;
  const availableForPurchaseSelector = `${AVAILABLE_CHANNELS_FORM.availableForPurchaseRadioButtons}${isAvailableForPurchaseSelector}`;
  updateProductManageInChannel(availableForPurchaseSelector);
}

export function updateProductPublish(isPublished) {
  const isPublishedSelector = isPublished ? valueTrue : valueFalse;
  const publishedSelector = `${AVAILABLE_CHANNELS_FORM.publishedRadioButtons}${isPublishedSelector}`;
  updateProductManageInChannel(publishedSelector);
}

export function updateProductVisibleInListings() {
  updateProductManageInChannel(AVAILABLE_CHANNELS_FORM.visibleInListingsButton);
}

function updateProductManageInChannel(manageSelector) {
  cy.get(AVAILABLE_CHANNELS_FORM.assignedChannels)
    .click()
    .get(manageSelector)
    .first()
    .scrollIntoView()
    .click()
    // cypress click is to fast - our app is nor ready to handle new event when click occurs - solution could be disabling save button until app is ready to handle new event
    .wait(1000)
    .waitForProgressBarToNotBeVisible()
    .addAliasToGraphRequest("ProductChannelListingUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldAppear()
    .wait("@ProductChannelListingUpdate");
}

export function fillUpCommonFieldsForAllProductTypes(
  { generalInfo, seo, metadata, productOrganization },
  createMode = true,
) {
  return fillUpAllCommonFieldsInCreateAndUpdate({ generalInfo, seo, metadata })
    .then(() => {
      if (createMode) {
        fillUpProductOrganization(productOrganization);
      } else {
        fillUpCollectionAndCategory({
          category: productOrganization.category,
          collection: productOrganization.collection,
        });
      }
    })
    .then(productOrgResp => productOrgResp);
}

export function fillUpAllCommonFieldsInCreateAndUpdate({
  generalInfo,
  seo,
  metadata,
}) {
  return fillUpProductGeneralInfo(generalInfo)
    .then(() => {
      editSeoSettings(seo);
    })
    .then(() => {
      cy.get(BUTTON_SELECTORS.expandMetadataButton).first().click();
      addMetadataField(metadata.public);
    })
    .then(() => {
      cy.get(BUTTON_SELECTORS.expandMetadataButton).last().click();
      addMetadataField(metadata.private);
    });
}

export function fillUpProductGeneralInfo({ name, description, rating }) {
  return cy
    .get(PRODUCT_DETAILS.productNameInput)
    .click({ force: true })
    .clearAndType(name)
    .get(PRODUCT_DETAILS.descriptionInput)
    .clearAndType(description)
    .get(PRODUCT_DETAILS.ratingInput)
    .clearAndType(rating);
}

export function fillUpProductTypeDialog({ productType }) {
  const organization = {};
  return cy
    .fillAutocompleteSelect(PRODUCTS_LIST.dialogProductTypeInput, productType)
    .then(selected => {
      organization.productType = selected;
      return organization;
    });
}

export function fillUpProductOrganization({
  productType,
  category,
  collection,
}) {
  const organization = {};
  return cy
    .fillAutocompleteSelect(PRODUCT_DETAILS.productTypeInput, productType, true)
    .then(selected => {
      organization.productType = selected;
      fillUpCollectionAndCategory({ category, collection });
    })
    .then(collectionAndCategoryResp => {
      organization.category = collectionAndCategoryResp.category;
      organization.collection = collectionAndCategoryResp.collection;
      return organization;
    });
}

export function fillUpCollectionAndCategory({ category, collection }) {
  const organization = {};
  return cy
    .fillAutocompleteSelect(PRODUCT_DETAILS.categoryInput, category, false)
    .then(selected => {
      organization.category = selected;
      cy.fillNewMultiSelect(PRODUCT_DETAILS.collectionInput, collection);
    })
    .then(selected => {
      organization.collection = selected;
      return organization;
    });
}

export function addVariantToDataGrid(variantName) {
  cy.get(PRODUCT_DETAILS.addVariantButton)
    .should("exist")
    .click()
    .get(PRODUCT_DETAILS.dataGridTable)
    .should("be.visible")
    .get(PRODUCT_DETAILS.firstRowDataGrid)
    .click({ force: true })
    .type(variantName, { force: true })
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldAppear()
    .waitForProgressBarToNotBeVisible();
}

export function enterVariantEditPage() {
  cy.get(PRODUCT_DETAILS.dataGridTable)
    .scrollIntoView()
    .should("be.visible")
    .wait(1000)
    .get(PRODUCT_DETAILS.editVariant)
    .click();
}
