// @ts-strict-ignore
import React from "react";

import { Channel, Product, Variant } from "./../types";
import { AvailabilityCard } from "./AvailabilityCard";
import {
  getAvailabilityCountForProduct,
  getAvailabilityCountForVariant,
} from "./availabilityCount";
import { CardSkeleton } from "./CardSkeleton";
import { CreateVariantTitle } from "./CreateVariantTitle";

interface VariantDetailsChannelsAvailabilityCardProps {
  variant: Variant;
  onManageClick?: () => void;
  disabled: boolean;
}

interface ProductDetailsChannelsAvailabilityCardProps {
  product: Product;
  onManageClick?: () => void;
  disabled: boolean;
}

interface WrapperProps {
  item: Product | Variant;
  children: ({ channels }: { channels: Channel[] }) => React.ReactElement;
}

const Wrapper: React.FC<WrapperProps> = ({ item, children }) => {
  if (!item) {
    return <CardSkeleton />;
  }

  const channels = item.channelListings.map(({ channel }) => channel);

  return children({ channels });
};

export const VariantDetailsChannelsAvailabilityCard: React.FC<
  VariantDetailsChannelsAvailabilityCardProps
> = ({ variant, onManageClick, disabled }) => (
  <Wrapper item={variant}>
    {({ channels }) => (
      <AvailabilityCard
        items={channels}
        productChannelListings={variant.product.channelListings}
      >
        <CreateVariantTitle
          onManageClick={onManageClick}
          disabled={disabled}
          availabilityCount={getAvailabilityCountForVariant(variant)}
          isEmpty={channels.length === 0}
        />
      </AvailabilityCard>
    )}
  </Wrapper>
);

export const ProductDetailsChannelsAvailabilityCard: React.FC<
  ProductDetailsChannelsAvailabilityCardProps
> = ({ product, onManageClick, disabled }) => (
  <Wrapper item={product}>
    {({ channels }) => (
      <AvailabilityCard
        items={channels}
        productChannelListings={product.channelListings}
      >
        <CreateVariantTitle
          onManageClick={onManageClick}
          disabled={disabled}
          availabilityCount={getAvailabilityCountForProduct(product)}
          isEmpty={channels.length === 0}
        />
      </AvailabilityCard>
    )}
  </Wrapper>
);
