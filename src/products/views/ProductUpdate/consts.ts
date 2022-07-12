import { ChannelWithVariantData } from "./types";

export const CHANNELS_AVAILIABILITY_MODAL_SELECTOR = "open-channels-picker";

export const initialChannelWithVariantData: ChannelWithVariantData = {
  variantsIdsToRemove: [],
  variantsIdsToAdd: [],
  availableVariants: [],
};

export const PRODUCT_UPDATE_FORM_ID = Symbol();
