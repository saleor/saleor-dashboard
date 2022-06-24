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
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import {
  ProductVariantCreateDataQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery,
} from "@saleor/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData,
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { errorMessages } from "@saleor/intl";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { createPreorderEndDateChangeHandler } from "@saleor/products/utils/handlers";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@saleor/types";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { useMultipleRichText } from "@saleor/utils/richText/useMultipleRichText";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

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
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  stocks: ProductStockInput[];
}

export interface UseProductVariantCreateFormOpts {
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
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
      "changeStock" | "selectAttribute" | "selectAttributeMultiple",
      FormsetChange
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changeMetadata: FormChange;
  changePreorderEndDate: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}

export interface UseProductVariantCreateFormOutput
  extends CommonUseFormResultWithHandlers<
      ProductVariantCreateData,
      ProductVariantCreateHandlers
    >,
    Omit<RichTextProps, "richText"> {
  formErrors: FormErrors<ProductVariantCreateData>;
  disabled: boolean;
}

export interface ProductVariantCreateFormProps
  extends UseProductVariantCreateFormOpts {
  children: (props: UseProductVariantCreateFormOutput) => React.ReactNode;
  product: ProductVariantCreateDataQuery["product"];
  onSubmit: (data: ProductVariantCreateData) => void;
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
};

function useProductVariantCreateForm(
  product: ProductVariantCreateDataQuery["product"],
  onSubmit: (data: ProductVariantCreateData) => void,
  disabled: boolean,
  opts: UseProductVariantCreateFormOpts,
): UseProductVariantCreateFormOutput {
  const intl = useIntl();
  const attributeInput = getVariantAttributeInputFromProduct(product);

  const form = useForm(initial, undefined, { confirmLeave: true });

  const {
    triggerChange,
    handleChange,
    data: formData,
    formId,
    setIsSubmitDisabled,
  } = form;

  const attributes = useFormset(attributeInput);
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

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);
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

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const submit = async () => handleFormSubmit(await getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const formDisabled =
    data.isPreorder &&
    data.hasPreorderEndDate &&
    !!form.errors.preorderEndDateTime;

  const isSaveDisabled = disabled || formDisabled || !onSubmit;
  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    disabled,
    formErrors: form.errors,
    handlers: {
      addStock: handleStockAdd,
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
