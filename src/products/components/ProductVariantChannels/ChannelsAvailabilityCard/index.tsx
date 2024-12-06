import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import { FormsetData } from "@dashboard/hooks/useFormset";

import { Product, Variant } from "./../types";
import { AvailabilityCard } from "./AvailabilityCard";
import {
  getAvailabilityCountForProduct,
  getAvailabilityCountForVariant,
} from "./availabilityCount";
import { CreateVariantTitle } from "./CreateVariantTitle";

interface VariantDetailsChannelsAvailabilityCardProps {
  variant: Variant;
  listings: FormsetData<ChannelPriceAndPreorderData, IChannelPriceAndPreorderArgs>;
  onManageClick: () => void;
  disabled: boolean;
}

interface ProductDetailsChannelsAvailabilityCardProps {
  product: Product;
  listings: FormsetData<ChannelPriceAndPreorderData, IChannelPriceAndPreorderArgs>;
  onManageClick: () => void;
  disabled: boolean;
}

export const VariantDetailsChannelsAvailabilityCard = ({
  variant,
  listings,
  onManageClick,
  disabled,
}: VariantDetailsChannelsAvailabilityCardProps) => (
  <AvailabilityCard
    allAvailableListings={listings}
    productChannelListings={variant?.product.channelListings}
  >
    <CreateVariantTitle
      onManageClick={onManageClick}
      disabled={disabled}
      availabilityCount={getAvailabilityCountForVariant(variant, listings)}
      isEmpty={listings.length === 0}
    />
  </AvailabilityCard>
);

export const ProductDetailsChannelsAvailabilityCard = ({
  product,
  listings,
  onManageClick,
  disabled,
}: ProductDetailsChannelsAvailabilityCardProps) => (
  <AvailabilityCard
    allAvailableListings={listings}
    productChannelListings={product?.channelListings}
  >
    <CreateVariantTitle
      onManageClick={onManageClick}
      disabled={disabled}
      availabilityCount={getAvailabilityCountForProduct(product, listings)}
      isEmpty={listings.length === 0}
    />
  </AvailabilityCard>
);
