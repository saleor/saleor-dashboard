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
import {
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

  const refreshVariantCompositionCounts = useCallback(() => {
    const deleteCount = stagedEdits.current.removedIds.size;
    const updatedIds = [...stagedEdits.current.updatesById.keys()].filter(
      id => !stagedEdits.current.removedIds.has(id),
    );

    setPendingVariantDeleteCount(deleteCount);
    setPendingVariantEditCount(updatedIds.length);
    setPendingVariantCreateCount(
      variants.current.added.length + stagedEdits.current.creates.length,
    );
    setStagedVariantCreates([...stagedEdits.current.creates]);
  }, []);

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

      // Added rows are page-local and cannot follow pagination/search.
      datagrid.setAdded([]);
      applyRehydratedDatagridState(productVariants);
    },
    [applyRehydratedDatagridState, datagrid, productVariants, variantsPageKey],
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
      const keptAdded = datagrid.added;

      datagrid.setRemoved(rehydrated.removed);
      datagrid.changes.current = rehydrated.updates;
      variants.current = {
        added: keptAdded,
        removed: rehydrated.removed,
        updates: rehydrated.updates,
      };
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
  const attributeChangeHandler = createAttributeChangeHandler(attributes, triggerChange);
  const handleAttributeChange = (...args: Parameters<typeof attributeChangeHandler>) => {
    setAttributesDirty(true);

    return attributeChangeHandler(...args);
  };
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    (value?: boolean) => {
      setAttributesDirty(true);
      triggerChange(value);
    },
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes,
    (value?: boolean) => {
      setAttributesDirty(true);
      triggerChange(value);
    },
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
    (value?: boolean) => {
      setAttributesDirty(true);
      triggerChange(value);
    },
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    (value?: boolean) => {
      setAttributesDirty(true);
      triggerChange(value);
    },
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
        stagedCreates: stagedPayload.stagedCreates,
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

    // Staged (generator) creates: keep only the rows BulkCreate rejected. Accepted
    // rows are already persisted — refetch returns them as real variants.
    if (submittedStagedCreateCount > 0) {
      const failedStagedIndexes = new Set<number>();

      for (const error of result) {
        if (
          error.__typename === "DatagridError" &&
          error.type === "create" &&
          typeof error.stagedIndex === "number"
        ) {
          failedStagedIndexes.add(error.stagedIndex);
        }
      }

      const keptStagedCreates = (submitData.variants.stagedCreates ?? []).filter((_, index) =>
        failedStagedIndexes.has(index),
      );

      stagedEdits.current = replaceStagedVariantCreates(stagedEdits.current, keptStagedCreates);
    }

    if (hasDatagridErrors) {
      const nextAdded = datagrid.added.filter((_, index) =>
        result.some(
          error =>
            error.__typename === "DatagridError" &&
            error.type === "create" &&
            error.index === index,
        ),
      );
      const nextUpdates = datagrid.changes.current.filter(change =>
        nextAdded.includes(change.row)
          ? result.some(
              error =>
                error.__typename === "DatagridError" &&
                error.type === "create" &&
                error.index === nextAdded.findIndex(r => r === change.row),
            )
          : result.some(
              error =>
                error.__typename === "DatagridError" &&
                error.type !== "create" &&
                error.variantId === productVariants[change.row]?.id,
            ),
      );

      datagrid.setAdded(nextAdded);
      datagrid.changes.current = nextUpdates;
      variants.current = {
        added: nextAdded,
        updates: nextUpdates,
        removed: datagrid.removed,
      };
      stagedEdits.current = syncVariantGridStagedEditsFromPage(
        stagedEdits.current,
        productVariants,
        variants.current,
      );
    } else if (submitData.variants.added.length > 0) {
      // BulkCreate accepted every grid-added row but a non-grid step (product,
      // channels, files) failed. Drop the accepted rows so retry does not recreate
      // them; keep edits to existing variants for the retry.
      const nextUpdates = datagrid.changes.current.filter(
        change => !datagrid.added.includes(change.row),
      );

      datagrid.setAdded([]);
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
