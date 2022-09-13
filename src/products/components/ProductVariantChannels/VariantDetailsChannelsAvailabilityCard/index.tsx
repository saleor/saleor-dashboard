import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@saleor/graphql";
import React from "react";

import { AvailabilityCard } from "./AvailabilityCard";
import {
  getAvailabilityCountForProduct,
  getAvailabilityCountForVariant,
} from "./availabilityCount";
import { CardSkeleton } from "./CardSkeleton";
import { CreateVariantTitle } from "./CreateVariantTitle";
import { NotAvailable } from "./NotAvailable";

interface VariantDetailsChannelsAvailabilityCardProps {
  variant: ProductVariantCreateDataQuery["product"] | ProductVariantFragment;
  onManageClick: () => void;
}

const isProduct = (
  x: ProductVariantCreateDataQuery["product"] | ProductVariantFragment,
): x is ProductVariantCreateDataQuery["product"] =>
  (x as ProductVariantCreateDataQuery["product"]).variants !== undefined;

const VariantDetailsChannelsAvailabilityCard: React.FC<VariantDetailsChannelsAvailabilityCardProps> = ({
  variant,
  onManageClick,
}) => {
  if (!variant) {
    return <CardSkeleton />;
  }

  const isAvailableInAnyChannels = !!variant.channelListings.length;

  if (!isAvailableInAnyChannels) {
    return <NotAvailable />;
  }

  if (isProduct(variant)) {
    return (
      <AvailabilityCard
        items={variant.channelListings}
        availabilityCount={getAvailabilityCountForProduct(variant)}
        productChannelListings={variant.channelListings}
      >
        <CreateVariantTitle onManageClick={onManageClick} />
      </AvailabilityCard>
    );
  }

  return (
    <AvailabilityCard
      items={variant.channelListings}
      availabilityCount={getAvailabilityCountForVariant(variant)}
      productChannelListings={variant.product.channelListings}
    />
  );
};

export default VariantDetailsChannelsAvailabilityCard;
