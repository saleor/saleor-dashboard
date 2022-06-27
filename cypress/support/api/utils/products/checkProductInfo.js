export function expectCorrectProductInformation(productResp, productData) {
  expectCorrectGeneralInformation(productResp, productData.generalInfo);
  expectCorrectSeoInfo(productResp, productData.seo);
  expectCorrectMetadataInfo(productResp.metadata, productData.metadata.public);
  expectCorrectMetadataInfo(
    productResp.privateMetadata,
    productData.metadata.private,
  );
  expectCorrectProductOrgInfo(productResp, productData.productOrganization);
  expectCorrectAttribute(productResp.attributes, productData.attribute);
}

export function expectCorrectProductVariantInformation(
  variantsResp,
  variantName,
  prices,
) {
  expect(variantsResp).to.have.length(1);
  expect(variantsResp[0].sku).to.be.eq(variantName);
  expect(variantsResp[0].channelListings[0].costPrice.amount).to.be.eq(
    prices.costPrice,
  );
  expect(variantsResp[0].channelListings[0].price.amount).to.be.eq(
    prices.sellingPrice,
  );
}

function expectCorrectGeneralInformation(productResp, generalInfo) {
  expect(productResp.name, "Check product name").to.be.eq(generalInfo.name);
  expect(productResp.description, "Check product description").includes(
    generalInfo.description,
  );
  expect(productResp.rating, "Check product rate").to.be.eq(generalInfo.rating);
}

function expectCorrectSeoInfo(productResp, seo) {
  expect(productResp.slug, "Check product slug").to.be.eq(seo.slug);
  expect(productResp.seoTitle, "Check product seo title").to.be.eq(seo.title);
  expect(productResp.seoDescription, "Check product seo description").to.be.eq(
    seo.description,
  );
}

function expectCorrectMetadataInfo(metadataResp, expectedMetadata) {
  expect(metadataResp, "Check metadata fields length").to.have.length(1);
  expect(metadataResp[0].key, "Check product metadata key").to.be.eq(
    expectedMetadata.name,
  );
  expect(metadataResp[0].value, "Check product metadata value").to.be.eq(
    expectedMetadata.value,
  );
}

function expectCorrectProductOrgInfo(productResp, productOrganization) {
  expect(productResp.productType.name, "Check product type name").to.be.eq(
    productOrganization.productType,
  );
  expect(productResp.category.name, "Check category name").to.be.eq(
    productOrganization.category,
  );
  expect(
    productResp.collections,
    "Check length of assigned collections",
  ).to.have.length(1);
  expect(productResp.collections[0].name, "Check collection name").to.be.eq(
    productOrganization.collection,
  );
}

function expectCorrectAttribute(attributes, attribute) {
  expect(attributes).to.have.length(1);
  expect(attributes[0].attribute.name, "Check attribute name").to.be.eq(
    attribute.name,
  );
}
