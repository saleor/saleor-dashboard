import { OutputData } from "@editorjs/editorjs";
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  RichTextProps,
} from "@saleor/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@saleor/attributes/utils/handlers";
import { AttributeInput } from "@saleor/components/Attributes";
import { ChannelOpts } from "@saleor/components/ChannelsAvailabilityCard/types";
import { DatagridChangeOpts } from "@saleor/components/Datagrid/useDatagridChange";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  ProductChannelListingUpdateInput,
  ProductFragment,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery,
} from "@saleor/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
  SubmitPromise,
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetAtomicData,
  FormsetChange,
  FormsetData,
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import {
  getAttributeInputFromProduct,
  getProductUpdatePageFormData,
} from "@saleor/products/utils/data";
import { PRODUCT_UPDATE_FORM_ID } from "@saleor/products/views/ProductUpdate/consts";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@saleor/types";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@saleor/utils/richText/context";
import { useMultipleRichText } from "@saleor/utils/richText/useMultipleRichText";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect, useMemo, useRef } from "react";

import { useProductChannelListingsForm } from "./formChannels";

export interface ProductUpdateFormData extends MetadataFormData {
  category: string | null;
  changeTaxCode: boolean;
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
  channels: ProductChannelListingUpdateInput;
  description: OutputData;
}
export interface ProductUpdateSubmitData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  channels: ProductChannelListingUpdateInput;
  collections: string[];
  description: OutputData;
  variants: DatagridChangeOpts;
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
      "selectAttribute" | "selectAttributeMultiple",
      FormsetChange<string>
    > {
  changeChannels: (id: string, data: ChannelOpts) => void;
  selectAttributeReference: FormsetChange<string[]>;
  selectAttributeFile: FormsetChange<File>;
  reorderAttributeValue: FormsetChange<ReorderEvent>;
  changeVariants: (data: DatagridChangeOpts) => void;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
  toggleChannel: (id: string) => void;
}

export interface UseProductUpdateFormOutput
  extends CommonUseFormResultWithHandlers<
      ProductUpdateData,
      ProductUpdateHandlers
    >,
    RichTextProps {
  formErrors: FormErrors<ProductUpdateSubmitData>;
}

export type UseProductUpdateFormRenderProps = Omit<
  UseProductUpdateFormOutput,
  "richText"
>;

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
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  hasVariants: boolean;
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  isSimpleProduct: boolean;
}

export interface ProductUpdateFormProps extends UseProductUpdateFormOpts {
  children: (props: UseProductUpdateFormRenderProps) => React.ReactNode;
  product: ProductFragment;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
  disabled: boolean;
}

function useProductUpdateForm(
  product: ProductFragment,
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise,
  disabled: boolean,
  opts: UseProductUpdateFormOpts,
): UseProductUpdateFormOutput {
  const initial = useMemo(
    () => getProductUpdatePageFormData(product, product?.variants),
    [product],
  );

  const form = useForm(initial, undefined, {
    confirmLeave: true,
    formId: PRODUCT_UPDATE_FORM_ID,
  });
  const variants = useRef<DatagridChangeOpts>({
    added: [],
    removed: [],
    updates: [],
  });
  const handleVariantChange = React.useCallback(
    (data: DatagridChangeOpts) => (variants.current = data),
    [],
  );

  const {
    handleChange,
    triggerChange,
    toggleValue,
    data: formData,
    setIsSubmitDisabled,
  } = form;

  const attributes = useFormset(getAttributeInputFromProduct(product));
  const {
    getters: attributeRichTextGetters,
    getValues: getAttributeRichTextValues,
  } = useMultipleRichText({
    initial: getRichTextDataFromAttributes(attributes.data),
    triggerChange,
  });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const richText = useRichText({
    initial: product?.description,
    loading: !product,
    triggerChange,
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId: PRODUCT_UPDATE_FORM_ID,
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const {
    channels,
    handleChannelChange,
    handleChannelToggle,
  } = useProductChannelListingsForm(product, triggerChange);

  const handleCollectionSelect = createMultiAutocompleteSelectHandler(
    event => toggleValue(event),
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
  const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxType,
    opts.taxTypes,
  );
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  const data: ProductUpdateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts,
    ),
    channels,
    description: null,
  };

  const getSubmitData = async (): Promise<ProductUpdateSubmitData> => ({
    ...data,
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(
        attributes.data,
        await getAttributeRichTextValues(),
      ),
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    channels,
    description: await richText.getValue(),
    variants: variants.current,
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
  });

  const submit = async () => handleFormSubmit(await getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isValid = () => {
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

    return true;
  };

  const isSaveDisabled = disabled || !isValid();

  useEffect(() => {
    setIsSubmitDisabled(isSaveDisabled);
  }, [isSaveDisabled]);

  return {
    change: handleChange,
    data,
    formErrors: form.errors,
    handlers: {
      changeChannels: handleChannelChange,
      changeMetadata,
      changeVariants: handleVariantChange,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMultiple: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange,
      selectCategory: handleCategorySelect,
      selectCollection: handleCollectionSelect,
      selectTaxRate: handleTaxTypeSelect,
      toggleChannel: handleChannelToggle,
    },
    submit,
    isSaveDisabled,
    richText,
    attributeRichTextGetters,
  };
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
  children,
  product,
  onSubmit,
  disabled,
  ...rest
}) => {
  const { richText, ...props } = useProductUpdateForm(
    product,
    onSubmit,
    disabled,
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

ProductUpdateForm.displayName = "ProductUpdateForm";
export default ProductUpdateForm;
