import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  RichTextProps,
} from "@dashboard/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@dashboard/attributes/utils/handlers";
import { ChannelData, ChannelPriceArgs } from "@dashboard/channels/utils";
import {
  AttributeInput,
  AttributeInputData,
} from "@dashboard/components/Attributes";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import {
  ProductErrorWithAttributesFragment,
  ProductTypeQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchProductTypesQuery,
  SearchWarehousesQuery,
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
} from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { errorMessages } from "@dashboard/intl";
import {
  getAttributeInputFromProductType,
  ProductType,
} from "@dashboard/products/utils/data";
import {
  createChannelsChangeHandler,
  createChannelsPriceChangeHandler,
  createProductTypeSelectHandler,
} from "@dashboard/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice,
  validateProductCreateData,
} from "@dashboard/products/utils/validation";
import { PRODUCT_CREATE_FORM_ID } from "@dashboard/products/views/ProductCreate/consts";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@dashboard/types";
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@dashboard/utils/richText/context";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import useRichText from "@dashboard/utils/richText/useRichText";
import { OutputData } from "@editorjs/editorjs";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { createPreorderEndDateChangeHandler } from "../../utils/handlers";
import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductCreateFormData extends MetadataFormData {
  category: string;
  channelListings: ChannelData[];
  collections: string[];
  description: OutputData;
  isAvailable: boolean;
  name: string;
  productType: ProductType;
  rating: number;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  slug: string;
  stockQuantity: number;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime: string;
  weight: string;
  taxClassId: string;
}
export interface ProductCreateData extends ProductCreateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  stocks: ProductStockInput[];
}

export interface ProductCreateHandlers
  extends Record<
      | "changeMetadata"
      | "selectCategory"
      | "selectCollection"
      | "selectProductType"
      | "selectTaxClass",
      FormChange
    >,
    Record<
      "changeStock" | "selectAttribute" | "selectAttributeMultiple",
      FormsetChange<string>
    >,
    Record<"changeChannelPrice", (id: string, data: ChannelPriceArgs) => void>,
    Record<
      "changeChannels",
      (
        id: string,
        data: Omit<ChannelData, "name" | "price" | "currency" | "id">,
      ) => void
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changePreorderEndDate: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}
export interface UseProductCreateFormOutput
  extends CommonUseFormResultWithHandlers<
      ProductCreateData,
      ProductCreateHandlers
    >,
    RichTextProps {
  disabled: boolean;
  formErrors: FormErrors<ProductCreateData>;
  validationErrors: ProductErrorWithAttributesFragment[];
}

export type UseProductCreateFormRenderProps = Omit<
  UseProductCreateFormOutput,
  "richText"
>;

export interface UseProductCreateFormOpts
  extends Record<
    "categories" | "collections" | "taxClasses",
    SingleAutocompleteChoiceType[]
  > {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCollections: React.Dispatch<
    React.SetStateAction<MultiAutocompleteChoiceType[]>
  >;
  setSelectedTaxClass: React.Dispatch<React.SetStateAction<string>>;
  setChannels: (channels: ChannelData[]) => void;
  selectedCollections: MultiAutocompleteChoiceType[];
  productTypes: RelayToFlat<SearchProductTypesQuery["search"]>;
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  currentChannels: ChannelData[];
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  selectedProductType?: ProductTypeQuery["productType"];
  onSelectProductType: (productTypeId: string) => void;
}

export interface ProductCreateFormProps extends UseProductCreateFormOpts {
  children: (props: UseProductCreateFormRenderProps) => React.ReactNode;
  initial?: Partial<ProductCreateFormData>;
  onSubmit: (data: ProductCreateData) => SubmitPromise;
  loading: boolean;
}

function useProductCreateForm(
  initial: Partial<ProductCreateFormData>,
  onSubmit: (data: ProductCreateData) => SubmitPromise,
  loading: boolean,
  opts: UseProductCreateFormOpts,
): UseProductCreateFormOutput {
  const intl = useIntl();
  const [validationErrors, setValidationErrors] = useState<
    ProductErrorWithAttributesFragment[]
  >([]);
  const defaultInitialFormData: ProductCreateFormData &
    Record<"productType", string> = {
    category: "",
    channelListings: opts.currentChannels,
    collections: [],
    description: null,
    isAvailable: false,
    metadata: [],
    name: "",
    privateMetadata: [],
    productType: null,
    rating: 0,
    seoDescription: "",
    seoTitle: "",
    sku: "",
    slug: "",
    stockQuantity: null,
    taxClassId: "",
    trackInventory: false,
    weight: "",
    globalSoldUnits: 0,
    globalThreshold: "",
    isPreorder: false,
    hasPreorderEndDate: false,
    preorderEndDateTime: "",
  };

  const form = useForm(
    {
      ...initial,
      ...defaultInitialFormData,
    },
    undefined,
    { confirmLeave: true, formId: PRODUCT_CREATE_FORM_ID },
  );

  const {
    triggerChange,
    toggleValue,
    handleChange,
    data: formData,
    formId,
  } = form;

  const attributes = useFormset<AttributeInputData>(
    opts.selectedProductType
      ? getAttributeInputFromProductType(opts.selectedProductType)
      : [],
  );
  const {
    getters: attributeRichTextGetters,
    getValues: getAttributeRichTextValues,
  } = useMultipleRichText({
    initial: getRichTextDataFromAttributes(attributes.data),
    triggerChange,
  });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset<ProductStockFormsetData>([]);
  const richText = useRichText({
    initial: null,
    triggerChange,
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const handleCollectionSelect = createMultiAutocompleteSelectHandler(
    toggleValue,
    opts.setSelectedCollections,
    opts.selectedCollections,
    opts.collections,
  );
  const handleCategorySelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedCategory,
    opts.categories,
  );
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange,
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
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
  const handleProductTypeSelect = createProductTypeSelectHandler(
    opts.onSelectProductType,
    triggerChange,
  );
  const handleStockChange: FormsetChange<string> = (id, value) => {
    triggerChange();
    stocks.change(id, value);
  };
  const handleStockAdd = (id: string) => {
    triggerChange();
    stocks.add({
      data: {
        quantityAllocated: 0,
      },
      id,
      label: opts.warehouses.find(warehouse => warehouse.id === id).name,
      value: "0",
    });
  };
  const handleStockDelete = (id: string) => {
    triggerChange();
    stocks.remove(id);
  };
  const handleTaxClassSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxClass,
    opts.taxClasses,
  );
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleChannelsChange = createChannelsChangeHandler(
    opts.currentChannels,
    opts.setChannels,
    triggerChange,
  );
  const handleChannelPriceChange = createChannelsPriceChangeHandler(
    opts.currentChannels,
    opts.setChannels,
    triggerChange,
  );

  const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
    form,
    triggerChange,
    intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText),
  );

  const data: ProductCreateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts,
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    description: null,
    productType: opts.selectedProductType,
    stocks: stocks.data,
  };

  const getData = async (): Promise<ProductCreateData> => ({
    ...data,
    description: await richText.getValue(),
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(
        attributes.data,
        await getAttributeRichTextValues(),
      ),
    ),
  });

  const handleSubmit = async (data: ProductCreateData) => {
    const errors = validateProductCreateData(data);

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

  const submit = async () => {
    const errors = await handleFormSubmit(await getData());

    if (errors.length) {
      setIsSubmitDisabled(isSubmitDisabled);
      setIsDirty(true);
    }

    return errors;
  };

  const {
    setExitDialogSubmitRef,
    setIsSubmitDisabled,
    setIsDirty,
  } = useExitFormDialog({
    formId: PRODUCT_CREATE_FORM_ID,
  });

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isValid = () => {
    if (!data.name || !data.productType) {
      return false;
    }

    if (
      data.isPreorder &&
      data.hasPreorderEndDate &&
      !!form.errors.preorderEndDateTime
    ) {
      return false;
    }

    if (opts.selectedProductType?.hasVariants) {
      return true;
    }

    const hasInvalidChannelListingPrices = data.channelListings.some(
      channel =>
        validatePrice(channel.price) || validateCostPrice(channel.costPrice),
    );

    if (hasInvalidChannelListingPrices) {
      return false;
    }
    return true;
  };

  const isSaveDisabled = loading || !onSubmit;
  const isSubmitDisabled = isSaveDisabled || !isValid();

  useEffect(() => {
    setIsSubmitDisabled(isSubmitDisabled);
    setIsDirty(true);
  }, [isSubmitDisabled]);

  return {
    change: handleChange,
    data,
    disabled: isSaveDisabled,
    formErrors: form.errors,
    validationErrors,
    handlers: {
      addStock: handleStockAdd,
      changeChannelPrice: handleChannelPriceChange,
      changeChannels: handleChannelsChange,
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
      selectAttributeReference: handleAttributeReferenceChange,
      selectCategory: handleCategorySelect,
      selectCollection: handleCollectionSelect,
      selectProductType: handleProductTypeSelect,
      selectTaxClass: handleTaxClassSelect,
    },
    submit,
    isSaveDisabled,
    richText,
    attributeRichTextGetters,
  };
}

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  children,
  initial,
  onSubmit,
  loading,
  ...rest
}) => {
  const { richText, ...props } = useProductCreateForm(
    initial || {},
    onSubmit,
    loading,
    rest,
  );

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>
        {children(props)}
      </RichTextContext.Provider>
    </form>
  );
};

ProductCreateForm.displayName = "ProductCreateForm";
export default ProductCreateForm;
