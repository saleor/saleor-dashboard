import { ProductDetailsVariantFragment } from "@saleor/graphql";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsWithVariantsAvailabilityDialog, {
  ChannelsAvailabilityDialogProps,
} from "./ChannelsWithVariantsAvailabilityDialog";

const props: ChannelsAvailabilityDialogProps = {
  channels: [
    {
      id: "1",
      name: "Channel 1",
      variantsIds: [],
    },
    {
      id: "2",
      name: "Channel 2",
      variantsIds: [],
    },
    {
      id: "3",
      name: "Channel 3",
      variantsIds: [],
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
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Channels / Channels with Variants Availability Dialog", module)
  .addDecorator(CommonDecorator)
  .add("default", () => <ChannelsWithVariantsAvailabilityDialog {...props} />);
