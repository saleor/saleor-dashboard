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
  ProductVariantCreateDataQuery,
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
  getVariantAttributeInputFromProduct,
} from "@dashboard/products/utils/data";
import {
  createPreorderEndDateChangeHandler,
  getChannelsInput,
} from "@dashboard/products/utils/handlers";
import { validateVariantData } from "@dashboard/products/utils/validation";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@dashboard/types";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";
import {
  concatChannelsBySelection,
  createChannelsWithPreorderInfo,
  validateChannels,
} from "../ProductVariantChannels/formOpretations";

export interface ProductVariantCreateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  quantityLimitPerCustomer: number | null;
  preorderEndDateTime?: string;
  variantName: string;
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  stocks: ProductStockInput[];
  channelListings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >;
}

export interface UseProductVariantCreateFormOpts {
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
}

export interface ProductVariantCreateHandlers
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
    Record<"addStock", (id: string, label: string) => void>,
    Record<"deleteStock", (id: string) => void> {
  changeMetadata: FormChange;
  updateChannels: (selectedChannelsIds: string[]) => void;
  changePreorderEndDate: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
  selectAttributeReferenceMetadata: FormsetMetadataChange<
    AttributeValuesMetadata[]
  >;
}

export interface UseProductVariantCreateFormOutput
  extends CommonUseFormResultWithHandlers<
      ProductVariantCreateData,
      ProductVariantCreateHandlers
    >,
    Omit<RichTextProps, "richText"> {
  formErrors: FormErrors<ProductVariantCreateData>;
  validationErrors: ProductErrorWithAttributesFragment[];
  disabled: boolean;
}

export interface ProductVariantCreateFormProps
  extends UseProductVariantCreateFormOpts {
  children: (props: UseProductVariantCreateFormOutput) => React.ReactNode;
  product: ProductVariantCreateDataQuery["product"];
  onSubmit: (data: ProductVariantCreateData) => SubmitPromise;
  disabled: boolean;
}

const initial: ProductVariantCreateFormData = {
  metadata: [],
  privateMetadata: [],
  sku: "",
  trackInventory: true,
  weight: "",
  isPreorder: false,
  globalThreshold: null,
  globalSoldUnits: 0,
  hasPreorderEndDate: false,
  preorderEndDateTime: "",
  quantityLimitPerCustomer: null,
  variantName: "",
};

function useProductVariantCreateForm(
  product: ProductVariantCreateDataQuery["product"],
  onSubmit: (data: ProductVariantCreateData) => SubmitPromise,
  disabled: boolean,
  opts: UseProductVariantCreateFormOpts,
): UseProductVariantCreateFormOutput {
  const intl = useIntl();
  const attributeInput = getVariantAttributeInputFromProduct(product);
  const [validationErrors, setValidationErrors] = useState<
    ProductErrorWithAttributesFragment[]
  >([]);

  const form = useForm(initial, undefined, { confirmLeave: true });

  const {
    triggerChange,
    handleChange,
    data: formData,
    formId,
    setIsSubmitDisabled,
  } = form;

  const currentChannelsWithPreorderInfo =
    createChannelsWithPreorderInfo(product);
  const channelsInput = getChannelsInput(currentChannelsWithPreorderInfo);

  const attributes = useFormset(attributeInput);
  const channels = useFormset(channelsInput);

  const {
    getters: attributeRichTextGetters,
    getValues: getAttributeRichTextValues,
  } = useMultipleRichText({
    initial: getRichTextDataFromAttributes(attributes.data),
    triggerChange,
  });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset<ProductStockFormsetData, string>([]);

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });

  const { makeChangeHandler: makeMetadataChangeHandler } =
    useMetadataChangeTrigger();

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
        quantityAllocated: 0,
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

  const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
    form,
    triggerChange,
    intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText),
  );

  const handleChannelChange: FormsetChange = (id, value) => {
    channels.change(id, value);
    triggerChange();
  };

  const handleUpdateChannels = (selectedIds: string[]) => {
    channels.set(
      concatChannelsBySelection(
        selectedIds,
        channels,
        currentChannelsWithPreorderInfo,
      ),
    );

    triggerChange();
  };

  const data: ProductVariantCreateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts,
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    stocks: stocks.data,
    channelListings: channels.data,
  };

  const getSubmitData = async (): Promise<ProductVariantCreateData> => ({
    ...data,
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(
        attributes.data,
        await getAttributeRichTextValues(),
      ),
    ),
  });

  const handleSubmit = async (data: ProductVariantCreateData) => {
    const errors = validateVariantData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    return onSubmit(data);
  };

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });

  const submit = async () => handleFormSubmit(await getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const invalidChannels = validateChannels(channels?.data);
  const invalidPreorder =
    data.isPreorder &&
    data.hasPreorderEndDate &&
    !!form.errors.preorderEndDateTime;

  const formDisabled = invalidPreorder || invalidChannels;
  const isSaveDisabled =
    disabled || formDisabled || !data.variantName || !onSubmit;

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

const ProductVariantCreateForm: React.FC<ProductVariantCreateFormProps> = ({
  children,
  product,
  onSubmit,
  disabled,
  ...rest
}) => {
  const props = useProductVariantCreateForm(product, onSubmit, disabled, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantCreateForm.displayName = "ProductVariantCreateForm";
export default ProductVariantCreateForm;
