const { softExpect } = chai;
export function expectCorrectProductInformation(productResp, productData) {
  expectCorrectGeneralInformation(productResp, productData.generalInfo);
  expectCorrectSeoInfo(productResp, productData.seo);
  expectCorrectMetadataInfo(productResp.metadata, productData.metadata.public);
  expectCorrectMetadataInfo(
    productResp.privateMetadata,
    productData.metadata.private
  );
  expectCorrectProductOrgInfo(productResp, productData.productOrganization);
  expectCorrectAttribute(productResp.attributes, productData.attribute);
}
export function expectCorrectProductVariantInformation(
  variantsResp,
  variantName,
  prices
) {
  softExpect(
    expect(variantsResp).to.have.length(1),
    softExpect(variantsResp[0].sku).to.be.eq(variantName),
    softExpect(variantsResp[0].channelListings[0].costPrice.amount).to.be.eq(
      prices.costPrice
    ),
    softExpect(variantsResp[0].channelListings[0].price.amount).to.be.eq(
      prices.sellingPrice
    )
  );
}
function expectCorrectGeneralInformation(productResp, generalInfo) {
  softExpect(productResp.name).to.be.eq(generalInfo.name);
  softExpect(productResp.description).includes(generalInfo.description);
  softExpect(productResp.rating).to.be.eq(generalInfo.rating);
}
function expectCorrectSeoInfo(productResp, seo) {
  softExpect(productResp.slug).to.be.eq(seo.slug);
  softExpect(productResp.seoTitle).to.be.eq(seo.title);
  softExpect(productResp.seoDescription).to.be.eq(seo.description);
}
function expectCorrectMetadataInfo(metadataResp, expectedMetadata) {
  softExpect(
    expect(metadataResp).to.have.length(1),
    softExpect(metadataResp[0].key).to.be.eq(expectedMetadata.name),
    softExpect(metadataResp[0].value).to.be.eq(expectedMetadata.value)
  );
}
function expectCorrectProductOrgInfo(productResp, productOrganization) {
  softExpect(productResp.productType.name).to.be.eq(
    productOrganization.productType
  );
  softExpect(productResp.category.name).to.be.eq(productOrganization.category);
  softExpect(
    expect(productResp.collections).to.have.length(1),
    softExpect(productResp.collections[0].name).to.be.eq(
      productOrganization.collection
    )
  );
}
function expectCorrectAttribute(attributes, attribute) {
  softExpect(
    expect(attributes).to.have.length(1),
    softExpect(attributes[0].attribute.name).to.be.eq(attribute.name)
  );
}
