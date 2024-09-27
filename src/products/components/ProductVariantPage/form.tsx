// @ts-strict-ignore
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  RichTextProps,
} from "@dashboard/attributes/utils/data";
import {
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeReferenceMetadataHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@dashboard/attributes/utils/handlers";
import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import { AttributeInput } from "@dashboard/components/Attributes";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { MetadataFormData } from "@dashboard/components/Metadata";
import {
  ProductErrorWithAttributesFragment,
  ProductVariantFragment,
  SearchPagesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
  SubmitPromise,
} from "@dashboard/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData,
  FormsetMetadataChange,
} from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { errorMessages } from "@dashboard/intl";
import {
  AttributeValuesMetadata,
  getAttributeInputFromVariant,
  getStockInputFromVariant,
} from "@dashboard/products/utils/data";
import {
  createMediaChangeHandler,
  createPreorderEndDateChangeHandler,
  getChannelsInput,
} from "@dashboard/products/utils/handlers";
import { validateProductVariant } from "@dashboard/products/utils/validation";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@dashboard/types";
import { arrayDiff } from "@dashboard/utils/arrays";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import getMetadata from "@dashboard/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ProductStockInput } from "../ProductStocks";
import {
  concatChannelsBySelection,
  extractChannelPricesFromVariantChannel,
} from "../ProductVariantChannels/formOpretations";

interface ProductVariantUpdateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  quantityLimitPerCustomer: number | null;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
  variantName: string;
  media: string[];
}
export interface ProductVariantUpdateData extends ProductVariantUpdateFormData {
  channelListings: FormsetData<ChannelPriceAndPreorderData, IChannelPriceAndPreorderArgs>;
  attributes: AttributeInput[];
  stocks: ProductStockInput[];
}
export interface ProductVariantUpdateSubmitData extends ProductVariantUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  addStocks: ProductStockInput[];
  channelListings: FormsetData<ChannelPriceAndPreorderData, IChannelPriceAndPreorderArgs>;
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

interface UseProductVariantUpdateFormOpts {
  currentChannels: ChannelPriceAndPreorderData[];
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
}

export interface ProductVariantUpdateHandlers
  extends Record<
      "changeStock" | "selectAttribute" | "selectAttributeMultiple" | "changeChannels",
      FormsetChange
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock", (id: string, label: string) => void>,
    Record<"deleteStock", (id: string) => void> {
  changePreorderEndDate: FormChange;
  changeMetadata: FormChange;
  changeMedia: (ids: string[]) => void;
  updateChannels: (selectedChannelsIds: string[]) => void;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
  selectAttributeReferenceMetadata: FormsetMetadataChange<AttributeValuesMetadata[]>;
}

interface UseProductVariantUpdateFormResult
  extends CommonUseFormResultWithHandlers<ProductVariantUpdateData, ProductVariantUpdateHandlers>,
    Omit<RichTextProps, "richText"> {
  formErrors: FormErrors<ProductVariantUpdateData>;
  validationErrors: ProductErrorWithAttributesFragment[];
  disabled: boolean;
}

interface ProductVariantUpdateFormProps extends UseProductVariantUpdateFormOpts {
  children: (props: UseProductVariantUpdateFormResult) => React.ReactNode;
  variant: ProductVariantFragment;
  loading: boolean;
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise;
}

function useProductVariantUpdateForm(
  variant: ProductVariantFragment,
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise,
  loading: boolean,
  opts: UseProductVariantUpdateFormOpts,
): UseProductVariantUpdateFormResult {
  const intl = useIntl();
  const attributeInput = getAttributeInputFromVariant(variant);
  const stockInput = getStockInputFromVariant(variant);
  const [validationErrors, setValidationErrors] = useState<ProductErrorWithAttributesFragment[]>(
    [],
  );
  const currentChannelsWithPreorderInfo = opts.currentChannels?.map(channel => {
    const variantChannel = variant?.channelListings?.find(
      channelListing => channelListing.channel.id === channel.id,
    );

    return {
      ...channel,
      preorderThreshold: variantChannel?.preorderThreshold?.quantity,
      soldUnits: variantChannel?.preorderThreshold?.soldUnits,
    };
  });
  const channelsInput = getChannelsInput(currentChannelsWithPreorderInfo);
  const initial: ProductVariantUpdateFormData = {
    metadata: variant?.metadata?.map(mapMetadataItemToInput),
    privateMetadata: variant?.privateMetadata?.map(mapMetadataItemToInput),
    sku: variant?.sku || "",
    trackInventory: variant?.trackInventory,
    isPreorder: !!variant?.preorder || false,
    globalThreshold: variant?.preorder?.globalThreshold?.toString() || null,
    globalSoldUnits: variant?.preorder?.globalSoldUnits || 0,
    hasPreorderEndDate: !!variant?.preorder?.endDate,
    preorderEndDateTime: variant?.preorder?.endDate,
    weight: variant?.weight?.value.toString() || "",
    quantityLimitPerCustomer: variant?.quantityLimitPerCustomer || null,
    variantName: variant?.name ?? "",
    media: variant?.media?.map(({ id }) => id) || [],
  };
  const form = useForm(initial, undefined, {
    confirmLeave: true,
  });
  const { handleChange, triggerChange, data: formData, formId, setIsSubmitDisabled } = form;
  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });
  const attributes = useFormset(attributeInput);
  const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
    useMultipleRichText({
      initial: getRichTextDataFromAttributes(attributes.data),
      triggerChange,
    });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset(stockInput);
  const channels = useFormset(channelsInput);
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleAttributeChangeWithName = (id: string, value: string) => {
    triggerChange();
    attributes.change(id, value === "" ? [] : [value]);
    handleChange({ target: { value, name: "name" } });
  };
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
    triggerChange,
  );
  const handleAttributeMetadataChange = createAttributeReferenceMetadataHandler(
    attributes.setMetadata,
    triggerChange,
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts,
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts,
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange,
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleStockAdd = (id: string, label: string) => {
    triggerChange();
    stocks.add({
      data: {
        quantityAllocated:
          variant?.stocks?.find(stock => stock.warehouse.id === id)?.quantityAllocated || 0,
      },
      id,
      label,
      value: "0",
    });
  };
  const handleStockChange = (id: string, value: string) => {
    triggerChange();
    stocks.change(id, value);
  };
  const handleStockDelete = (id: string) => {
    triggerChange();
    stocks.remove(id);
  };
  const handleChannelChange: FormsetChange = (id, value) => {
    channels.change(id, value);
    triggerChange();
  };
  const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
    form,
    triggerChange,
    intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText),
  );
  const handleMediaChange = createMediaChangeHandler(form, triggerChange);
  const handleUpdateChannels = (selectedIds: string[]) => {
    const allChannels = variant.product.channelListings.map(listing => {
      const variantChannel = variant?.channelListings?.find(
        channelListing => channelListing.channel.id === listing.channel.id,
      );

      if (variantChannel) {
        const { costPrice, price } = extractChannelPricesFromVariantChannel(variantChannel);

        return {
          ...variantChannel.channel,
          currency: variantChannel.channel.currencyCode,
          preorderThreshold: variantChannel?.preorderThreshold.quantity,
          soldUnits: variantChannel?.preorderThreshold?.soldUnits,
          price,
          costPrice,
        };
      }

      return {
        ...listing.channel,
        currency: listing.channel.currencyCode,
        price: "",
        preorderThreshold: null,
        soldUnits: null,
      };
    });

    channels.set(concatChannelsBySelection(selectedIds, channels, allChannels));
    triggerChange();
  };
  const dataStocks = stocks.data.map(stock => stock.id);
  const variantStocks = variant?.stocks.map(stock => stock.warehouse.id) || [];
  const stockDiff = arrayDiff(variantStocks, dataStocks);
  const addStocks = stocks.data.filter(stock =>
    stockDiff.added.some(addedStock => addedStock === stock.id),
  );
  const updateStocks = stocks.data.filter(
    stock => !stockDiff.added.some(addedStock => addedStock === stock.id),
  );
  const data: ProductVariantUpdateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts,
    ),
    channelListings: channels.data,
    stocks: stocks.data,
  };
  const disabled = data.isPreorder && data.hasPreorderEndDate && !!form.errors.preorderEndDateTime;
  const getSubmitData = async (): Promise<ProductVariantUpdateSubmitData> => ({
    ...formData,
    ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
    addStocks,
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(attributes.data, await getAttributeRichTextValues()),
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    channelListings: channels.data,
    removeStocks: stockDiff.removed,
    updateStocks,
  });
  const handleSubmit = async (data: ProductVariantUpdateSubmitData) => {
    const validationProductErrors = validateProductVariant(data, intl);

    setValidationErrors(validationProductErrors);

    if (validationProductErrors.length > 0) {
      return validationProductErrors;
    }

    const apiErrors = await onSubmit(data);

    if (!apiErrors?.length) {
      attributesWithNewFileValue.set([]);
    }

    return apiErrors;
  };
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });
  const submit = async () => handleFormSubmit(await getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isSaveDisabled = loading || disabled;

  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    disabled,
    formErrors: form.errors,
    validationErrors,
    handlers: {
      addStock: handleStockAdd,
      changeChannels: handleChannelChange,
      updateChannels: handleUpdateChannels,
      changeMetadata,
      changeStock: handleStockChange,
      changePreorderEndDate: handlePreorderEndDateChange,
      changeMedia: handleMediaChange,
      deleteStock: handleStockDelete,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChangeWithName,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMultiple: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange,
      selectAttributeReferenceMetadata: handleAttributeMetadataChange,
    },
    submit,
    isSaveDisabled,
    attributeRichTextGetters,
  };
}

const ProductVariantUpdateForm: React.FC<ProductVariantUpdateFormProps> = ({
  children,
  variant,
  onSubmit,
  loading,
  ...rest
}) => {
  const props = useProductVariantUpdateForm(variant, onSubmit, loading, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantUpdateForm.displayName = "ProductVariantUpdateForm";
export default ProductVariantUpdateForm;
