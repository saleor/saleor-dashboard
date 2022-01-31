import { getAttributesDisplayData } from "@saleor/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler
} from "@saleor/attributes/utils/handlers";
import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs
} from "@saleor/channels/utils";
import { AttributeInput } from "@saleor/components/Attributes";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
  SubmitPromise
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { errorMessages } from "@saleor/intl";
import {
  getAttributeInputFromVariant,
  getStockInputFromVariant
} from "@saleor/products/utils/data";
import {
  createPreorderEndDateChangeHandler,
  getChannelsInput
} from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import { arrayDiff } from "@saleor/utils/arrays";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { ProductStockInput } from "../ProductStocks";

export interface ProductVariantUpdateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  quantityLimitPerCustomer: number | null;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}
export interface ProductVariantUpdateData extends ProductVariantUpdateFormData {
  channelListings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
  attributes: AttributeInput[];
  stocks: ProductStockInput[];
}
export interface ProductVariantUpdateSubmitData
  extends ProductVariantUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  addStocks: ProductStockInput[];
  channelListings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export interface UseProductVariantUpdateFormOpts {
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelPriceAndPreorderData[];
  referencePages: SearchPages_search_edges_node[];
  referenceProducts: SearchProducts_search_edges_node[];
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
}

export interface ProductVariantUpdateHandlers
  extends Record<
      | "changeStock"
      | "selectAttribute"
      | "selectAttributeMultiple"
      | "changeChannels",
      FormsetChange
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changePreorderEndDate: FormChange;
  changeMetadata: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}

export interface UseProductVariantUpdateFormResult
  extends CommonUseFormResultWithHandlers<
    ProductVariantUpdateData,
    ProductVariantUpdateHandlers
  > {
  formErrors: FormErrors<ProductVariantUpdateData>;
  disabled: boolean;
}

export interface ProductVariantUpdateFormProps
  extends UseProductVariantUpdateFormOpts {
  children: (props: UseProductVariantUpdateFormResult) => React.ReactNode;
  variant: ProductVariant;
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise;
}

function useProductVariantUpdateForm(
  variant: ProductVariant,
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise,
  opts: UseProductVariantUpdateFormOpts
): UseProductVariantUpdateFormResult {
  const intl = useIntl();
  const attributeInput = getAttributeInputFromVariant(variant);
  const stockInput = getStockInputFromVariant(variant);

  const currentChannelsWithPreorderInfo = opts.currentChannels?.map(channel => {
    const variantChannel = variant?.channelListings?.find(
      channelListing => channelListing.channel.id === channel.id
    );

    return {
      ...channel,
      preorderThreshold: variantChannel?.preorderThreshold?.quantity,
      soldUnits: variantChannel?.preorderThreshold?.soldUnits
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
    quantityLimitPerCustomer: variant?.quantityLimitPerCustomer || null
  };

  const form = useForm(initial, undefined, {
    confirmLeave: true
  });

  const {
    handleChange,
    triggerChange,
    data: formData,
    setChanged,
    hasChanged,
    formId
  } = form;

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId
  });

  const attributes = useFormset(attributeInput);
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset(stockInput);
  const channels = useFormset(channelsInput);
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );

  const handleStockAdd = (id: string) => {
    triggerChange();
    stocks.add({
      data: {
        quantityAllocated:
          variant?.stocks?.find(stock => stock.warehouse.id === id)
            ?.quantityAllocated || 0
      },
      id,
      label: opts.warehouses.find(warehouse => warehouse.id === id).name,
      value: "0"
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
    intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText)
  );

  const dataStocks = stocks.data.map(stock => stock.id);
  const variantStocks = variant?.stocks.map(stock => stock.warehouse.id) || [];
  const stockDiff = arrayDiff(variantStocks, dataStocks);

  const addStocks = stocks.data.filter(stock =>
    stockDiff.added.some(addedStock => addedStock === stock.id)
  );
  const updateStocks = stocks.data.filter(
    stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
  );

  const data: ProductVariantUpdateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts
    ),
    channelListings: channels.data,
    stocks: stocks.data
  };

  const disabled =
    channels?.data.some(
      channelData =>
        validatePrice(channelData.value.price) ||
        validateCostPrice(channelData.value.costPrice)
    ) ||
    (data.isPreorder &&
      data.hasPreorderEndDate &&
      !!form.errors.preorderEndDateTime);

  const submitData: ProductVariantUpdateSubmitData = {
    ...formData,
    ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
    addStocks,
    attributes: attributes.data,
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    channelListings: channels.data,
    removeStocks: stockDiff.removed,
    updateStocks
  };

  const handleSubmit = async (data: ProductVariantUpdateSubmitData) => {
    const errors = await onSubmit(data);

    if (!errors?.length) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
    setChanged
  });

  const submit = () => handleFormSubmit(submitData);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  return {
    change: handleChange,
    data,
    disabled,
    formErrors: form.errors,
    handlers: {
      addStock: handleStockAdd,
      changeChannels: handleChannelChange,
      changeMetadata,
      changeStock: handleStockChange,
      changePreorderEndDate: handlePreorderEndDateChange,
      deleteStock: handleStockDelete,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMultiple: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange
    },
    hasChanged,
    submit
  };
}

const ProductVariantUpdateForm: React.FC<ProductVariantUpdateFormProps> = ({
  children,
  variant,
  onSubmit,
  ...rest
}) => {
  const props = useProductVariantUpdateForm(variant, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantUpdateForm.displayName = "ProductVariantUpdateForm";
export default ProductVariantUpdateForm;
