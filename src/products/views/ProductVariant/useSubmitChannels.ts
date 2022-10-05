import {
  ProductVariantFragment,
  useProductChannelListingUpdateMutation,
  useProductVariantChannelListingUpdateMutation,
} from "@saleor/graphql";
import { extractMutationErrors } from "@saleor/misc";
import { ProductVariantUpdateSubmitData } from "@saleor/products/components/ProductVariantPage/form";

type Product = ProductVariantUpdateSubmitData;
type Variant = ProductVariantFragment;

const isFormDataChanged = (data: Product, variant: Variant) =>
  data.channelListings.some(channel => {
    const variantChannel = variant.channelListings.find(
      variantChannel => variantChannel.channel.id === channel.id,
    );

    const priceHasChanged =
      channel.value.price !== variantChannel?.price?.amount.toString();

    const costPriceHasChanged =
      channel.value.costPrice !== variantChannel?.costPrice?.amount.toString();

    const preorderThresholdHasChanged =
      channel.value?.preorderThreshold !==
      variantChannel?.preorderThreshold.quantity;

    return (
      priceHasChanged || costPriceHasChanged || preorderThresholdHasChanged
    );
  });

const hasRecordDeleted = (data: Product, variant: Variant) =>
  data.channelListings.length !== variant.channelListings.length;

const createProductUpdateListingInput = (data: Product, variant: Variant) => {
  const ids = data.channelListings.map(c => c.data.id);
  return variant.channelListings
    .map(c => c.channel.id)
    .filter(cId => !ids.includes(cId))
    .map(channelId => ({ channelId, removeVariants: [variant.id] }));
};

const createVariantUpdateListingInput = (data: Product) =>
  data.channelListings.map(listing => ({
    channelId: listing.id,
    costPrice: listing.value.costPrice || null,
    price: listing.value.price,
    preorderThreshold: listing.value.preorderThreshold,
  }));

export const useSubmitChannels = () => {
  const [updateChannelListing] = useProductChannelListingUpdateMutation();
  const [
    updateChannels,
    updateChannelsOpts,
  ] = useProductVariantChannelListingUpdateMutation();

  const handleSubmitChannels = async (data: Product, variant: Variant) => {
    const channelsHaveChanged = isFormDataChanged(data, variant);
    const amountOfRecordsHasChanged = hasRecordDeleted(data, variant);

    if (amountOfRecordsHasChanged) {
      const updateChannels = createProductUpdateListingInput(data, variant);
      await updateChannelListing({
        variables: {
          id: variant.product.id,
          input: { updateChannels },
        },
      });
    }

    if (channelsHaveChanged) {
      return extractMutationErrors(
        updateChannels({
          variables: {
            id: variant.id,
            input: createVariantUpdateListingInput(data),
          },
        }),
      );
    }

    return [];
  };

  return { handleSubmitChannels, updateChannelsOpts };
};
