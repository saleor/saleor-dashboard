import { createAttribute } from "../requests/Attribute";
import { updateVariantPrice } from "../requests/Product";
import {
  createDigitalContent,
  createTypeProduct,
  productAttributeAssignmentUpdate,
  setProductTypeAsDigital
} from "../requests/ProductType";

export function addDigitalContentAndUpdateProductType(
  variantId,
  productTypeId,
  channelId,
  price = 1
) {
  createDigitalContent(variantId);
  setProductTypeAsDigital(productTypeId);
  updateVariantPrice({ variantId, channelId, price });
}

export function createProductTypeWithNewVariantSelectionAttribute({
  name,
  inputType,
  attributeValues
}) {
  let attribute;
  let productType;

  return createAttribute({
    name,
    inputType,
    attributeValues
  })
    .then(attributeResp => {
      attribute = attributeResp;
      createTypeProduct({
        name,
        attributeId: attribute.id,
        productAttributes: false
      });
    })
    .then(productTypeResp => {
      productType = productTypeResp;
      productAttributeAssignmentUpdate({
        productTypeId: productType.id,
        attributeId: attribute.id,
        variantSelection: true
      });
    })
    .then(() => ({ attribute, productType }));
}
