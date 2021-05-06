import { ChannelData } from "@saleor/channels/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsWithVariantsAvailabilityDialog, {
  ChannelsAvailabilityDialogProps
} from "./ChannelsWithVariantsAvailabilityDialog";

const props: ChannelsAvailabilityDialogProps = {
  channels: [
    {
      id: "1",
      name: "Channel 1"
    },
    {
      id: "2",
      name: "Channel 2"
    },
    {
      id: "3",
      name: "Channel 3"
    }
  ] as ChannelData[],
  variants: [
    {
      id: "variantA",
      name: "Variant A",
      media: [
        {
          url:
            "https://test-envs-stack-testenvsmediabucket050c0d50-qdkqrzgoumxv.s3.amazonaws.com/feature-assing-variants-to-channel-listings/products/saleordemoproduct_fd_juice_06.png"
        }
      ]
    },
    {
      id: "variantB",
      name: "Variant B",
      media: [
        {
          url:
            "https://test-envs-stack-testenvsmediabucket050c0d50-qdkqrzgoumxv.s3.amazonaws.com/feature-assing-variants-to-channel-listings/products/saleordemoproduct_fd_juice_05.png"
        }
      ]
    },
    {
      id: "variantC",
      name: "Variant C",
      media: []
    }
  ] as ProductDetails_product_variants[],
  onChannelsWithVariantsConfirm: () => undefined,
  addVariantToChannel: () => undefined,
  removeVariantFromChannel: () => undefined,
  channelsWithVariantsData: {
    ["1"]: {
      selectedVariantsIds: ["variantA", "variantB"],
      variantsIdsToRemove: [],
      variantsIdsToAdd: []
    },
    ["2"]: {
      selectedVariantsIds: ["variantA", "variantC"],
      variantsIdsToRemove: [],
      variantsIdsToAdd: []
    },
    ["3"]: {
      selectedVariantsIds: [],
      variantsIdsToRemove: [],
      variantsIdsToAdd: []
    }
  },
  onChannelsAvailiabilityModalClose: () => undefined,
  isChannelsAvailabilityModalOpen: true,
  toggleAllChannels: () => undefined,
  toggleAllChannelVariants: () => () => undefined,
  haveChannelsWithVariantsDataChanged: true
};

storiesOf("Channels / Channels with Variants Availability Dialog", module)
  .addDecorator(CommonDecorator)
  .add("default", () => <ChannelsWithVariantsAvailabilityDialog {...props} />);
