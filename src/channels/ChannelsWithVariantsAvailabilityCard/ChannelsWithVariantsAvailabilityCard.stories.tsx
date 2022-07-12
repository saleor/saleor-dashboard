import { ProductDetailsVariantFragment } from "@saleor/graphql";
import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsWithVariantsAvailabilityCard, {
  ChannelsWithVariantsAvailabilityCardProps,
} from "./ChannelsWithVariantsAvailabilityCard";

const props: ChannelsWithVariantsAvailabilityCardProps = {
  channels: [
    {
      id: "1",
      name: "Channel 1",
      isAvailableForPurchase: false,
      isPublished: true,
      publicationDate: "2020-07-30",
      availableForPurchase: null,
      visibleInListings: false,
      currency: "EUR",
      variantsIds: ["variantA"],
      costPrice: "5",
      price: "15",
    },
    {
      id: "2",
      name: "Channel 2",
      isAvailableForPurchase: false,
      isPublished: true,
      publicationDate: "2020-07-30",
      availableForPurchase: null,
      visibleInListings: false,
      currency: "EUR",
      variantsIds: ["variantA"],
      costPrice: "5",
      price: "15",
    },
    {
      id: "3",
      name: "Channel 3",
      isAvailableForPurchase: false,
      isPublished: true,
      publicationDate: "2020-07-30",
      availableForPurchase: null,
      visibleInListings: false,
      currency: "EUR",
      variantsIds: ["variantA"],
      costPrice: "5",
      price: "15",
    },
  ],
  variants: [
    {
      id: "variantA",
      name: "Variant A",
      media: [
        {
          url:
            "https://test-envs-stack-testenvsmediabucket050c0d50-qdkqrzgoumxv.s3.amazonaws.com/feature-assing-variants-to-channel-listings/products/saleordemoproduct_fd_juice_06.png",
        },
      ],
    },
    {
      id: "variantB",
      name: "Variant B",
      media: [
        {
          url:
            "https://test-envs-stack-testenvsmediabucket050c0d50-qdkqrzgoumxv.s3.amazonaws.com/feature-assing-variants-to-channel-listings/products/saleordemoproduct_fd_juice_05.png",
        },
      ],
    },
    {
      id: "variantC",
      name: "Variant C",
      media: [],
    },
  ] as ProductDetailsVariantFragment[],
  channelsWithVariantsData: {
    ["1"]: {
      selectedVariantsIds: ["variantA", "variantB"],
      variantsIdsToRemove: [],
      variantsIdsToAdd: [],
    },
    ["2"]: {
      selectedVariantsIds: ["variantA", "variantC"],
      variantsIdsToRemove: [],
      variantsIdsToAdd: [],
    },
    ["3"]: {
      selectedVariantsIds: [],
      variantsIdsToRemove: [],
      variantsIdsToAdd: [],
    },
  },
  messages: {
    hiddenLabel: "Not published",
    visibleLabel: "Published",
  },
  onChange: () => undefined,
  openModal: () => undefined,
};

storiesOf("Channels / Channels with variants availability card", module)
  .addDecorator(CommonDecorator)
  .addDecorator(CentralPlacementDecorator)
  .add("default", () => <ChannelsWithVariantsAvailabilityCard {...props} />);
