import { getValueWithDefault } from "./utils/Utils";

export function createTypeProduct({
  name,
  attributeId,
  hasVariants = true,
  slug = name,
  shippable = true,
  kind = "NORMAL",
  productAttributes = true,
}) {
  const kindLines = `kind: ${kind}`;
  const productAttributesLine = getValueWithDefault(
    productAttributes && attributeId,
    `productAttributes: "${attributeId}"`,
  );
  const variantAttributesLine = getValueWithDefault(
    hasVariants && attributeId,
    `variantAttributes: "${attributeId}"`,
  );
  const mutation = `mutation{
    productTypeCreate(input: {
      name: "${name}"
      slug: "${slug}"
      isDigital: ${!shippable}
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
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function productAttributeAssignmentUpdate({
  productTypeId,
  attributeId,
  variantSelection = false,
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

export function getProductType(productTypeId) {
  const query = `query{
    productType(id:"${productTypeId}"){
      id
      name
      kind
      isShippingRequired
      weight{
        value
      }
      productAttributes{
        name
      }
      assignedVariantAttributes{
        attribute{
          name
        }
        variantSelection
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

export function setProductTypeAsDigital(productTypeId, isDigital = true) {
  const mutation = `mutation updateProductType{
    productTypeUpdate(id:"${productTypeId}", input:{
     isDigital:${isDigital}
    }){
     errors{
       field
       message
     } 
    }
   }`;
  return cy.sendRequestWithQuery(mutation);
}

export function assignAttribute(
  productTypeId,
  attributeId,
  attributeType = "VARIANT",
) {
  const mutation = `mutation{
    productAttributeAssign(productTypeId:"${productTypeId}", operations:{
      id:"${attributeId}"
      type: ${attributeType}
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
