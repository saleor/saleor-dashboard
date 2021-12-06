import { returnValueDependsOnShopVersion } from "../../formatData/dataDependingOnVersion";
import { getValueWithDefault } from "./utils/Utils";

export function createTypeProduct({
  name,
  attributeId,
  hasVariants = true,
  slug = name,
  shippable = true,
  kind = "NORMAL"
}) {
  const kindLines = returnValueDependsOnShopVersion("3.1", `kind: ${kind}`);
  const productAttributesLine = getValueWithDefault(
    attributeId,
    `productAttributes: "${attributeId}"`
  );
  const variantAttributesLine = getValueWithDefault(
    hasVariants && attributeId,
    `variantAttributes: "${attributeId}"`
  );
  const mutation = `mutation{
    productTypeCreate(input: {
      name: "${name}"
      slug: "${slug}"
      ${productAttributesLine}
      hasVariants: ${hasVariants}
      ${variantAttributesLine}
      isShippingRequired:${shippable}
      ${kindLines}
    }){
      errors{
        field
        message
      }
      productType{
        id
        name
      }
    }
  } `;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.productTypeCreate.productType");
}

export function productAttributeAssignmentUpdate({
  productTypeId,
  attributeId,
  variantSelection = true
}) {
  const mutation = `mutation {
    productAttributeAssignmentUpdate(
      operations: {id: "${attributeId}", variantSelection: ${variantSelection}}    productTypeId:"${productTypeId}") {
      errors {
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getProductTypes(first, search) {
  const query = `query{
    productTypes(first:${first}, filter:{
      search:"${search}"
    }){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.productTypes.edges);
}

export function deleteProductType(productTypeId) {
  const mutation = `mutation{
    productTypeDelete(id:"${productTypeId}"){
      productErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getProductType(productTypeId) {
  const query = `query{
    productType(id:"${productTypeId}"){
      id
      name
      isShippingRequired
      weight{
        value
      }
      productAttributes{
        name
      }
      variantAttributes{
        name
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.productType");
}

export function createDigitalContent(variantId) {
  const mutation = `mutation{
    digitalContentCreate(input:{
      useDefaultSettings:true,
      automaticFulfillment: true,
      contentFile:""
    }, variantId:"${variantId}"){
      content{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
