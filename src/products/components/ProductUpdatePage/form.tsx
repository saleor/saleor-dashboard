import { OutputData } from "@editorjs/editorjs";
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
  ChannelData,
  ChannelPreorderArgs,
  ChannelPriceArgs
} from "@saleor/channels/utils";
import { AttributeInput } from "@saleor/components/Attributes";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
  SubmitPromise
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetAtomicData,
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { errorMessages } from "@saleor/intl";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import {
  getAttributeInputFromProduct,
  getProductUpdatePageFormData,
  getStockInputFromProduct
} from "@saleor/products/utils/data";
import {
  createChannelsChangeHandler,
  createChannelsPreorderChangeHandler,
  createChannelsPriceChangeHandler,
  createPreorderEndDateChangeHandler
} from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { PRODUCT_UPDATE_FORM_ID } from "@saleor/products/views/ProductUpdate/consts";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import { arrayDiff } from "@saleor/utils/arrays";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductUpdateFormData extends MetadataFormData {
  category: string | null;
  changeTaxCode: boolean;
  channelsData: ChannelData[];
  channelsWithVariants: ChannelsWithVariantsData;
  channelListings: ChannelData[];
  chargeTaxes: boolean;
  collections: string[];
  isAvailable: boolean;
  name: string;
  rating: number;
  slug: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  taxCode: string;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
  weight: string;
}
export interface FileAttributeInputData {
  attributeId: string;
  file: File;
}
export type FileAttributeInput = FormsetAtomicData<
  FileAttributeInputData,
  string[]
>;

export interface FileAttributesSubmitData {
  fileAttributes: FileAttributeInput[];
}
export interface ProductUpdateData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  description: OutputData;
  stocks: ProductStockInput[];
}
export interface ProductUpdateSubmitData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  collections: string[];
  description: OutputData;
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export interface ProductUpdateHandlers
  extends Record<
      | "changeMetadata"
      | "selectCategory"
      | "selectCollection"
      | "selectTaxRate",
      FormChange
    >,
    Record<
      "changeStock" | "selectAttribute" | "selectAttributeMultiple",
      FormsetChange<string>
    >,
    Record<"changeChannelPrice", (id: string, data: ChannelPriceArgs) => void>,
    Record<
      "changeChannelPreorder",
      (id: string, data: ChannelPreorderArgs) => void
    >,
    Record<
      "changeChannels",
      (
        id: string,
        data: Omit<ChannelData, "name" | "price" | "currency" | "id">
      ) => void
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changeDescription: RichTextEditorChange;
  changePreorderEndDate: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}
export interface UseProductUpdateFormResult
  extends CommonUseFormResultWithHandlers<
    ProductUpdateData,
    ProductUpdateHandlers
  > {
  disabled: boolean;
  formErrors: FormErrors<ProductUpdateSubmitData>;
}

export interface UseProductUpdateFormOpts
  extends Record<
    "categories" | "collections" | "taxTypes",
    SingleAutocompleteChoiceType[]
  > {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCollections: React.Dispatch<
    React.SetStateAction<MultiAutocompleteChoiceType[]>
  >;
  setSelectedTaxType: React.Dispatch<React.SetStateAction<string>>;
  selectedCollections: MultiAutocompleteChoiceType[];
  warehouses: SearchWarehouses_search_edges_node[];
  channelsData: ChannelData[];
  hasVariants: boolean;
  currentChannels: ChannelData[];
  setChannels: (data: ChannelData[]) => void;
  setChannelsData: (data: ChannelData[]) => void;
  referencePages: SearchPages_search_edges_node[];
  referenceProducts: SearchProducts_search_edges_node[];
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  channelsWithVariants: ChannelsWithVariantsData;
  isSimpleProduct: boolean;
}

export interface ProductUpdateFormProps extends UseProductUpdateFormOpts {
  children: (props: UseProductUpdateFormResult) => React.ReactNode;
  product: ProductDetails_product;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
}

const getStocksData = (
  product: ProductDetails_product,
  stocks: FormsetData<ProductStockFormsetData, string>
) => {
  if (product?.productType?.hasVariants) {
    return { addStocks: [], removeStocks: [], updateStocks: [] };
  }

  const dataStocks = stocks.map(stock => stock.id);
  const variantStocks =
    product?.variants[0]?.stocks.map(stock => stock.warehouse.id) || [];
  const stockDiff = arrayDiff(variantStocks, dataStocks);

  return {
    addStocks: stocks.filter(stock =>
      stockDiff.added.some(addedStock => addedStock === stock.id)
    ),
    removeStocks: stockDiff.removed,
    updateStocks: stocks.filter(
      stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
    )
  };
};

function useProductUpdateForm(
  product: ProductDetails_product,
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise,
  opts: UseProductUpdateFormOpts
): UseProductUpdateFormResult {
  const intl = useIntl();

  const form = useForm(
    getProductUpdatePageFormData(
      product,
      product?.variants,
      opts.currentChannels,
      opts.channelsData,
      opts.channelsWithVariants
    ),
    undefined,
    { confirmLeave: true, formId: PRODUCT_UPDATE_FORM_ID }
  );

  const {
    handleChange,
    triggerChange,
    toggleValue,
    data: formData,
    setChanged,
    hasChanged
  } = form;

  const attributes = useFormset(getAttributeInputFromProduct(product));
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset(getStockInputFromProduct(product));
  const [description, changeDescription] = useRichText({
    initial: product?.description,
    triggerChange
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId: PRODUCT_UPDATE_FORM_ID
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleCollectionSelect = createMultiAutocompleteSelectHandler(
    event => toggleValue(event),
    opts.setSelectedCollections,
    opts.selectedCollections,
    opts.collections
  );
  const handleCategorySelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedCategory,
    opts.categories
  );
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
  const handleStockChange: FormsetChange<string> = (id, value) => {
    triggerChange();
    stocks.change(id, value);
  };
  const handleStockAdd = (id: string) => {
    triggerChange();
    stocks.add({
      data: {
        quantityAllocated: 0
      },
      id,
      label: opts.warehouses.find(warehouse => warehouse.id === id).name,
      value: "0"
    });
  };
  const handleStockDelete = (id: string) => {
    triggerChange();
    stocks.remove(id);
  };
  const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxType,
    opts.taxTypes
  );
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  const handleChannelsChange = createChannelsChangeHandler(
    opts.isSimpleProduct ? opts.currentChannels : opts.channelsData,
    opts.isSimpleProduct ? opts.setChannels : opts.setChannelsData,
    triggerChange
  );

  const handleChannelPreorderChange = createChannelsPreorderChangeHandler(
    opts.isSimpleProduct ? opts.currentChannels : opts.channelsData,
    opts.isSimpleProduct ? opts.setChannels : opts.setChannelsData,
    triggerChange
  );

  const handleChannelPriceChange = createChannelsPriceChangeHandler(
    opts.isSimpleProduct ? opts.currentChannels : opts.channelsData,
    opts.isSimpleProduct ? opts.setChannels : opts.setChannelsData,
    triggerChange
  );

  const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
    form,
    triggerChange,
    intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText)
  );

  const data: ProductUpdateData = {
    ...formData,
    channelListings: opts.currentChannels,
    channelsData: opts.channelsData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts
    ),
    description: description.current,
    stocks: stocks.data
  };

  // Need to make it function to always have description.current up to date
  const getSubmitData = (): ProductUpdateSubmitData => ({
    ...data,
    ...getStocksData(product, stocks.data),
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
    attributes: attributes.data,
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    description: description.current
  });

  const handleSubmit = async (data: ProductUpdateSubmitData) => {
    const errors = await onSubmit(data);

    if (!errors?.length) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };

  const handleFormSubmit = useHandleFormSubmit({
    formId: form.formId,
    onSubmit: handleSubmit,
    setChanged
  });

  const submit = async () => handleFormSubmit(getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const shouldEnableSave = () => {
    if (!data.name) {
      return false;
    }

    if (
      data.isPreorder &&
      data.hasPreorderEndDate &&
      !!form.errors.preorderEndDateTime
    ) {
      return false;
    }

    if (opts.hasVariants) {
      return true;
    }

    const hasInvalidChannelListingPrices = data.channelListings.some(
      channel =>
        validatePrice(channel.price) || validateCostPrice(channel.costPrice)
    );

    if (hasInvalidChannelListingPrices) {
      return false;
    }
    return true;
  };

  const disabled = !shouldEnableSave();

  return {
    change: handleChange,
    data,
    disabled,
    formErrors: form.errors,
    handlers: {
      addStock: handleStockAdd,
      changeChannelPrice: handleChannelPriceChange,
      changeChannelPreorder: handleChannelPreorderChange,
      changeChannels: handleChannelsChange,
      changeDescription,
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
      selectTaxRate: handleTaxTypeSelect
    },
    hasChanged,
    submit
  };
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
  children,
  product,
  onSubmit,
  ...rest
}) => {
  const props = useProductUpdateForm(product, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductUpdateForm.displayName = "ProductUpdateForm";
export default ProductUpdateForm;
