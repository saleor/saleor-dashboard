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
  type DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import {
  type ProductDetailsVariantFragment,
  type ProductFragment,
  type ProductVariantBulkCreateInput,
} from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useFormset from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useLocale from "@dashboard/hooks/useLocale";
import { datagridAddedRowsToCreateInputs } from "@dashboard/products/hooks/datagridAddedRowsToCreateInputs";
import {
  appendStagedVariantCreate,
  appendStagedVariantCreates,
  buildVariantGridSubmitPayload,
  clearStagedVariantCreates,
  createEmptyVariantGridStagedEdits,
  rehydrateVariantGridDatagridOpts,
  removeStagedVariantCreatesAtIndexes,
  replaceStagedVariantCreates,
  stageVariantCreatesInStore,
  stageVariantRemovalsInStore,
  syncVariantGridStagedEditsFromPage,
  type VariantGridStagedEditsState,
} from "@dashboard/products/hooks/variantGridStagedEdits";
import {
  getAttributeInputFromProduct,
  getProductUpdatePageFormData,
} from "@dashboard/products/utils/data";
import { PRODUCT_UPDATE_FORM_ID } from "@dashboard/products/views/ProductUpdate/consts";
import createMultiselectChangeHandler from "@dashboard/utils/handlers/multiselectChangeHandler";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { RichTextContext } from "@dashboard/utils/richText/context";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import useRichText from "@dashboard/utils/richText/useRichText";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { useIntl } from "react-intl";

import { countDirtyChannels, useProductChannelListingsForm } from "./formChannels";
import { messages } from "./messages";
import { buildProductSaveComposition, hasProductSaveComposition } from "./saveComposition";
import {
  type ProductUpdateData,
  type ProductUpdateFormProps,
  type ProductUpdateSubmitData,
  type SubmitResult,
  type UseProductUpdateFormOpts,
  type UseProductUpdateFormOutput,
} from "./types";
import { prepareVariantChangeData } from "./utils";

export function useProductUpdateForm(
  product: ProductFragment,
  onSubmit: (data: ProductUpdateSubmitData) => SubmitResult,
  disabled: boolean,
  refetch: () => Promise<any>,
  opts: UseProductUpdateFormOpts,
): UseProductUpdateFormOutput {
  const { variants: productVariants } = opts;
  const initial = useMemo(
    () => getProductUpdatePageFormData(product, productVariants),
    // Intentionally omit productVariants: simple-product fields come from
    // product.defaultVariant. Re-binding to the paginated grid would reset
    // SKU when the user searches or pages the variants table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const stagedEdits = useRef<VariantGridStagedEditsState>(createEmptyVariantGridStagedEdits());
  const previousVariantsPageKey = useRef<string | null>(null);
  const [pendingVariantDeleteCount, setPendingVariantDeleteCount] = useState(0);
  const [pendingVariantEditCount, setPendingVariantEditCount] = useState(0);
  const [pendingVariantCreateCount, setPendingVariantCreateCount] = useState(0);
  const [stagedVariantCreates, setStagedVariantCreates] = useState<ProductVariantBulkCreateInput[]>(
    [],
  );
  const [attributesDirty, setAttributesDirty] = useState(false);
  const variantsPageKey = useMemo(
    () => productVariants.map(variant => variant.id).join("\0"),
    [productVariants],
  );

  const variantAttributes = useMemo(
    () => product?.productType?.variantAttributes ?? [],
    [product?.productType?.variantAttributes],
  );

  const refreshVariantCompositionCounts = useCallback(() => {
    const deleteCount = stagedEdits.current.removedIds.size;
    const updatedIds = [...stagedEdits.current.updatesById.keys()].filter(
      id => !stagedEdits.current.removedIds.has(id),
    );

    setPendingVariantDeleteCount(deleteCount);
    setPendingVariantEditCount(updatedIds.length);
    // Page-local bulk-add rows are not in `creates` until fullscreen close.
    // Untouched / empty ghost rows must not count as new variants.
    setPendingVariantCreateCount(
      stagedEdits.current.creates.length +
        datagridAddedRowsToCreateInputs(variants.current, variantAttributes).length,
    );
    setStagedVariantCreates([...stagedEdits.current.creates]);
  }, [variantAttributes]);

  const applyRehydratedDatagridState = useCallback(
    (pageVariants: ProductDetailsVariantFragment[]) => {
      const rehydrated = rehydrateVariantGridDatagridOpts(stagedEdits.current, pageVariants);

      datagrid.setAdded([]);
      datagrid.setRemoved(rehydrated.removed);
      datagrid.changes.current = rehydrated.updates;
      variants.current = rehydrated;
      refreshVariantCompositionCounts();
    },
    [datagrid, refreshVariantCompositionCounts],
  );

  useEffect(
    function rehydrateStagedEditsOnVariantsPageChange() {
      if (previousVariantsPageKey.current === variantsPageKey) {
        return;
      }

      const isFirstPageLoad = previousVariantsPageKey.current === null;

      previousVariantsPageKey.current = variantsPageKey;

      if (isFirstPageLoad) {
        return;
      }

      applyRehydratedDatagridState(productVariants);
    },
    [applyRehydratedDatagridState, productVariants, variantsPageKey],
  );

  const handleVariantChange = React.useCallback(
    (data: DatagridChangeOpts) => {
      const prepared = prepareVariantChangeData(data, locale, product);

      variants.current = prepared;
      stagedEdits.current = syncVariantGridStagedEditsFromPage(
        stagedEdits.current,
        productVariants,
        prepared,
      );
      refreshVariantCompositionCounts();
      triggerChange();
    },
    [locale, product, productVariants, refreshVariantCompositionCounts, triggerChange],
  );

  const handleStageVariantRemovals = React.useCallback(
    (ids: string[]) => {
      if (ids.length === 0) {
        return;
      }

      stagedEdits.current = stageVariantRemovalsInStore(stagedEdits.current, ids);

      const rehydrated = rehydrateVariantGridDatagridOpts(stagedEdits.current, productVariants);

      datagrid.setRemoved(rehydrated.removed);
      datagrid.changes.current = rehydrated.updates;
      variants.current = rehydrated;
      refreshVariantCompositionCounts();
      triggerChange();
    },
    [datagrid, productVariants, refreshVariantCompositionCounts, triggerChange],
  );

  const handleStageVariantCreates = React.useCallback(
    (inputs: ProductVariantBulkCreateInput[]) => {
      const { state, stagedCount, skippedCount } = stageVariantCreatesInStore(
        stagedEdits.current,
        inputs,
      );

      stagedEdits.current = state;
      refreshVariantCompositionCounts();

      if (stagedCount > 0) {
        triggerChange();
      }

      // Already-staged duplicates are not failures — close the modal cleanly.
      const onlyDuplicatesSkipped =
        stagedCount === 0 && skippedCount > 0 && skippedCount === inputs.length;

      return {
        success: stagedCount > 0 || onlyDuplicatesSkipped,
        successCount: stagedCount,
        failedCount: onlyDuplicatesSkipped ? 0 : inputs.length - stagedCount,
        attributeErrors: [],
        otherErrors: [],
      };
    },
    [refreshVariantCompositionCounts, triggerChange],
  );

  const handleAddStagedVariantCreate = React.useCallback(() => {
    stagedEdits.current = appendStagedVariantCreate(stagedEdits.current, { attributes: [] });
    refreshVariantCompositionCounts();
    triggerChange();
  }, [refreshVariantCompositionCounts, triggerChange]);

  const handleRemoveStagedVariantCreates = React.useCallback(
    (indexes: number[]) => {
      stagedEdits.current = removeStagedVariantCreatesAtIndexes(stagedEdits.current, indexes);
      refreshVariantCompositionCounts();
      triggerChange();
    },
    [refreshVariantCompositionCounts, triggerChange],
  );

  const handleClearStagedVariantCreates = React.useCallback(() => {
    stagedEdits.current = clearStagedVariantCreates(stagedEdits.current);
    refreshVariantCompositionCounts();
    triggerChange();
  }, [refreshVariantCompositionCounts, triggerChange]);

  const handleReplaceStagedVariantCreates = React.useCallback(
    (creates: ProductVariantBulkCreateInput[]) => {
      stagedEdits.current = replaceStagedVariantCreates(stagedEdits.current, creates);
      refreshVariantCompositionCounts();
      triggerChange();
    },
    [refreshVariantCompositionCounts, triggerChange],
  );

  const handlePromoteDatagridAddedRows = React.useCallback(() => {
    const addedRows = new Set(variants.current.added);

    if (addedRows.size === 0) {
      return;
    }

    const addedCreates = datagridAddedRowsToCreateInputs(variants.current, variantAttributes);

    if (addedCreates.length > 0) {
      stagedEdits.current = appendStagedVariantCreates(stagedEdits.current, addedCreates);
    }

    datagrid.setAdded([]);
    datagrid.changes.current = datagrid.changes.current.filter(
      change => !addedRows.has(change.row),
    );
    variants.current = {
      ...variants.current,
      added: [],
      updates: variants.current.updates.filter(update => !addedRows.has(update.row)),
    };
    refreshVariantCompositionCounts();

    if (addedCreates.length > 0) {
      triggerChange();
    }
  }, [datagrid, refreshVariantCompositionCounts, triggerChange, variantAttributes]);
  const attributes = useFormset(getAttributeInputFromProduct(product));
  const markAttributesChanged = (value = true) => {
    // Save / exit-dialog read `attributesDirty`, not useForm's generic change flag.
    setAttributesDirty(value);
    triggerChange(value);
  };
  const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
    useMultipleRichText({
      initial: getRichTextDataFromAttributes(attributes.data),
      triggerChange: markAttributesChanged,
    });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const richText = useRichText({
    initial: product?.description,
    loading: !product,
    triggerChange,
  });
  const { setExitDialogSubmitRef, setExitDialogDescription, setIsDirty } = useExitFormDialog({
    formId: PRODUCT_UPDATE_FORM_ID,
  });
  const intl = useIntl();

  useEffect(
    function setProductExitDialogDescription() {
      setExitDialogDescription(intl.formatMessage(messages.leaveDialogDescription));

      return () => setExitDialogDescription(null);
    },
    [intl, setExitDialogDescription],
  );

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
  const handleAttributeChange = createAttributeChangeHandler(attributes, markAttributesChanged);
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    markAttributesChanged,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes,
    markAttributesChanged,
  );
  const handleAttributeMetadataChange = createAttributeReferenceAdditionalDataHandler(
    attributes,
    markAttributesChanged,
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
    markAttributesChanged,
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    markAttributesChanged,
  );
  const handleTaxClassSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxClass,
    opts.taxClasses,
  );
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

  const getSubmitData = async (): Promise<ProductUpdateSubmitData> => {
    const stagedPayload = buildVariantGridSubmitPayload(stagedEdits.current);
    // Bulk-edit rows still sitting in the datagrid (user saved without closing).
    const fromAddedRows = datagridAddedRowsToCreateInputs(variants.current, variantAttributes);

    return {
      ...form.changedData,
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
      variants: {
        ...variants.current,
        removedVariantIds: stagedPayload.removedVariantIds,
        stagedUpdateVariants: stagedPayload.updateVariants,
        stagedUpdateChanges: stagedPayload.updateChanges,
        stagedCreates: [...stagedPayload.stagedCreates, ...fromAddedRows],
      },
    };
  };
  const saveComposition = buildProductSaveComposition({
    changedFieldNames: Object.keys(form.changedData),
    descriptionDirty: richText.isDirty,
    attributesDirty: attributesDirty || attributesWithNewFileValue.data.length > 0,
    dirtyChannelCount: countDirtyChannels(channels, product?.channelListings),
    variantEditCount: pendingVariantEditCount,
    variantCreateCount: pendingVariantCreateCount,
    variantDeleteCount: pendingVariantDeleteCount,
  });
  const hasUnsavedChanges = hasProductSaveComposition(saveComposition);

  useEffect(
    function syncExitDialogDirtyFromSaveComposition() {
      setIsDirty(hasUnsavedChanges);
    },
    [hasUnsavedChanges, setIsDirty],
  );

  const handleSubmit = async (data: ProductUpdateSubmitData) => {
    const errors = await onSubmit(data);

    if (!errors?.length) {
      attributesWithNewFileValue.set([]);
      setAttributesDirty(false);
    }

    return errors;
  };
  const handleFormSubmit = useHandleFormSubmit({
    formId: form.formId,
    onSubmit: handleSubmit,
  });
  const submit = useCallback(async () => {
    // Persist page-local bulk-edit rows before the request. Otherwise a failed
    // BulkCreate clears `added` and the drafts are gone.
    handlePromoteDatagridAddedRows();

    const submitData = await getSubmitData();
    const result = await handleFormSubmit(submitData);
    const succeeded = !result?.length;
    const submittedStagedCreateCount = submitData.variants.stagedCreates?.length ?? 0;

    await refetch();

    if (succeeded) {
      cleanChanged();
      datagrid.setAdded([]);
      datagrid.changes.current = [];
      datagrid.setRemoved([]);
      variants.current = {
        added: [],
        removed: [],
        updates: [],
      };
      stagedEdits.current = createEmptyVariantGridStagedEdits();
      setPendingVariantDeleteCount(0);
      setPendingVariantEditCount(0);
      setPendingVariantCreateCount(0);
      setStagedVariantCreates([]);

      return result;
    }

    // Keep draft state for retry, but trim rows the API already accepted so a retry
    // cannot create duplicates. Create runs even when earlier steps fail.
    const hasDatagridErrors = result.some(error => error.__typename === "DatagridError");
    // BulkCreate is all-or-nothing: one rejected row means no new variant was created.
    const createFailed = result.some(
      error => error.__typename === "DatagridError" && error.type === "create",
    );

    if (submittedStagedCreateCount > 0 && !createFailed) {
      stagedEdits.current = clearStagedVariantCreates(stagedEdits.current);
    }

    if (hasDatagridErrors) {
      const nextUpdates = datagrid.changes.current.filter(change =>
        result.some(
          error =>
            error.__typename === "DatagridError" &&
            error.type !== "create" &&
            error.variantId === productVariants[change.row]?.id,
        ),
      );

      datagrid.changes.current = nextUpdates;
      variants.current = {
        added: [],
        updates: nextUpdates,
        removed: datagrid.removed,
      };
      stagedEdits.current = syncVariantGridStagedEditsFromPage(
        stagedEdits.current,
        productVariants,
        variants.current,
      );
    }

    refreshVariantCompositionCounts();

    return result;
  }, [
    cleanChanged,
    datagrid,
    getSubmitData,
    handleFormSubmit,
    handlePromoteDatagridAddedRows,
    productVariants,
    refetch,
    refreshVariantCompositionCounts,
  ]);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isValid = () => {
    if (!data.name) {
      return false;
    }

    return true;
  };
  const isSaveDisabled = disabled || !hasUnsavedChanges || !isValid();
  const isSubmitDisabled = isSaveDisabled;

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
      changeVariants: handleVariantChange,
      stageVariantRemovals: handleStageVariantRemovals,
      stageVariantCreates: handleStageVariantCreates,
      addStagedVariantCreate: handleAddStagedVariantCreate,
      promoteDatagridAddedRows: handlePromoteDatagridAddedRows,
      removeStagedVariantCreates: handleRemoveStagedVariantCreates,
      clearStagedVariantCreates: handleClearStagedVariantCreates,
      replaceStagedVariantCreates: handleReplaceStagedVariantCreates,
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
    pendingVariantDeleteCount,
    saveComposition,
    richText,
    attributeRichTextGetters,
    touchedChannels: touchedChannels.current,
    stagedVariantCreates,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    return props.submit();
  };

  return (
    <form onSubmit={handleSubmit} data-test-id="product-update-form">
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
