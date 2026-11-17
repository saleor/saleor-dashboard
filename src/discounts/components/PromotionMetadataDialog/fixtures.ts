import { type PromotionMetadataQuery } from "@dashboard/graphql";

export const promotionId = "UHJvbW90aW9uOjE=";

export const createPromotionMetadata = (campaignCode: string): PromotionMetadataQuery => ({
  __typename: "Query",
  promotion: {
    __typename: "Promotion",
    id: promotionId,
    metadata: [{ __typename: "MetadataItem", key: "campaign.code", value: campaignCode }],
    privateMetadata: [{ __typename: "MetadataItem", key: "budget.owner", value: "marketing" }],
  },
});
