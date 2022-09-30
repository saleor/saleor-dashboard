export const COLLECTION_SELECTORS = {
  createCollectionButton: "[data-test-id = 'create-collection']",
  nameInput: "[name='name']",
  saveButton: "[data-test='button-bar-confirm']",
  addProductButton: "[data-test-id='add-product']",
  descriptionInput: '[data-test-id="rich-text-editor-description"]',
  placeholder: "[data-placeholder]",
};

export const collectionRow = collectionId =>
  `[data-test-id*="${collectionId}"]`;
export const productRow = productId => `[data-test-id*="${productId}"]`;
