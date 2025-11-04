// @ts-strict-ignore
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
} from "@dashboard/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceAdditionalDataHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@dashboard/attributes/utils/handlers";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { ProductFragment } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useFormset from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useLocale from "@dashboard/hooks/useLocale";
import {
  getAttributeInputFromProduct,
  getProductUpdatePageFormData,
} from "@dashboard/products/utils/data";
import { PRODUCT_UPDATE_FORM_ID } from "@dashboard/products/views/ProductUpdate/consts";
import createMultiselectChangeHandler from "@dashboard/utils/handlers/multiselectChangeHandler";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import getMetadata from "@dashboard/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@dashboard/utils/richText/context";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import useRichText from "@dashboard/utils/richText/useRichText";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as React from "react";

import { useProductChannelListingsForm } from "./formChannels";
import {
  ProductUpdateData,
  ProductUpdateFormProps,
  ProductUpdateSubmitData,
  SubmitResult,
  UseProductUpdateFormOpts,
  UseProductUpdateFormOutput,
} from "./types";
import { prepareVariantChangeData } from "./utils";

export function useProductUpdateForm(
  product: ProductFragment,
  onSubmit: (data: ProductUpdateSubmitData) => SubmitResult,
  disabled: boolean,
  refetch: () => Promise<any>,
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
  const {
    handleChange,
    triggerChange,
    toggleValues,
    data: formData,
    setIsSubmitDisabled,
    cleanChanged,
  } = form;
  const { locale } = useLocale();
  const datagrid = useDatagridChangeState();
  const variants = useRef<DatagridChangeOpts>({
    added: [],
    removed: [],
    updates: [],
  });
  const handleVariantChange = React.useCallback(
    (data: DatagridChangeOpts) => {
      variants.current = prepareVariantChangeData(data, locale, product);
      triggerChange();
    },
    [locale, product, triggerChange],
  );
  const attributes = useFormset(getAttributeInputFromProduct(product));
  const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
    useMultipleRichText({
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
    handleChannelListUpdate,
    touched: touchedChannels,
  } = useProductChannelListingsForm(product, triggerChange);
  const handleCollectionSelect = createMultiselectChangeHandler(
    toggleValues,
    opts.setSelectedCollections,
  );
  const handleCategorySelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedCategory,
    opts.categories,
  );
  const handleAttributeChange = createAttributeChangeHandler(attributes, triggerChange);
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes,
    triggerChange,
  );
  const handleAttributeMetadataChange = createAttributeReferenceAdditionalDataHandler(
    attributes,
    triggerChange,
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts,
    opts.fetchReferenceCategories,
    opts.fetchReferenceCollections,
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts,
    opts.fetchMoreReferenceCategories,
    opts.fetchMoreReferenceCollections,
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
  const handleTaxClassSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxClass,
    opts.taxClasses,
  );
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const data: ProductUpdateData = {
    ...formData,
    attributes: getAttributesDisplayData(attributes.data, attributesWithNewFileValue.data, {
      pages: opts.referencePages,
      products: opts.referenceProducts,
      collections: opts.referenceCollections,
      categories: opts.referenceCategories,
    }),
    channels,
    description: null,
  };

  const getSubmitData = async (): Promise<ProductUpdateSubmitData> => ({
    ...form.changedData,
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(attributes.data, await getAttributeRichTextValues()),
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    channels: {
      ...channels,
      updateChannels: channels.updateChannels.filter(listing =>
        touchedChannels.current.includes(listing.channelId),
      ),
    },
    description: richText.isDirty ? await richText.getValue() : undefined,
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
  const submit = useCallback(async () => {
    const result = await handleFormSubmit(await getSubmitData());

    cleanChanged();
    await refetch();
    datagrid.setAdded(prevAdded =>
      prevAdded.filter((_, index) =>
        result.some(
          error =>
            error.__typename === "DatagridError" &&
            error.type === "create" &&
            error.index === index,
        ),
      ),
    );
    datagrid.changes.current = datagrid.changes.current.filter(change =>
      datagrid.added.includes(change.row)
        ? result.some(
            error =>
              error.__typename === "DatagridError" &&
              error.type === "create" &&
              error.index === datagrid.added.findIndex(r => r === change.row),
          )
        : result.some(
            error =>
              error.__typename === "DatagridError" &&
              error.type !== "create" &&
              error.variantId === product.variants[change.row].id,
          ),
    );
    datagrid.setRemoved([]);
    variants.current = {
      added: [],
      removed: [],
      updates: [],
    };

    return result;
  }, [datagrid, handleFormSubmit, getSubmitData]);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isValid = () => {
    if (!data.name) {
      return false;
    }

    if (data.isPreorder && data.hasPreorderEndDate && !!form.errors.preorderEndDateTime) {
      return false;
    }

    return true;
  };
  const isSaveDisabled = disabled;
  const isSubmitDisabled = isSaveDisabled || !isValid();

  useEffect(() => {
    setIsSubmitDisabled(isSubmitDisabled);
  }, [isSubmitDisabled]);

  return {
    change: handleChange,
    data,
    datagrid,
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
      selectAttributeReferenceAdditionalData: handleAttributeMetadataChange,
      selectCategory: handleCategorySelect,
      selectCollection: handleCollectionSelect,
      selectTaxClass: handleTaxClassSelect,
      updateChannelList: handleChannelListUpdate,
    },
    submit,
    isSaveDisabled,
    richText,
    attributeRichTextGetters,
  };
}

const ProductUpdateForm = ({
  children,
  product,
  onSubmit,
  refetch,
  disabled,
  ...rest
}: ProductUpdateFormProps) => {
  const { datagrid, richText, ...props } = useProductUpdateForm(
    product,
    onSubmit,
    disabled,
    refetch,
    rest,
  );

  return (
    <form onSubmit={props.submit} data-test-id="product-update-form">
      <DatagridChangeStateContext.Provider value={datagrid}>
        <RichTextContext.Provider value={richText}>
          {children({ ...props, richText })}
        </RichTextContext.Provider>
      </DatagridChangeStateContext.Provider>
    </form>
  );
};

ProductUpdateForm.displayName = "ProductUpdateForm";
export default ProductUpdateForm;
