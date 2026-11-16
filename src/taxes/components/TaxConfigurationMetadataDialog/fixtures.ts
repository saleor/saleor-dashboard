import { type TaxConfigurationMetadataQuery } from "@dashboard/graphql";

export const taxConfigurationId = "VGF4Q29uZmlndXJhdGlvbjox";

export const createTaxConfigurationMetadata = (
  taxProfile: string,
): TaxConfigurationMetadataQuery => ({
  __typename: "Query",
  taxConfiguration: {
    __typename: "TaxConfiguration",
    id: taxConfigurationId,
    metadata: [{ __typename: "MetadataItem", key: "erp.taxProfile", value: taxProfile }],
    privateMetadata: [{ __typename: "MetadataItem", key: "avalara.companyCode", value: "ACME" }],
  },
});
