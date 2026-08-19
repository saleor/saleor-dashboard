// @ts-strict-ignore
import {
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@dashboard/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
} from "@dashboard/attributes/utils/handlers";
import {
  type AttributeErrorFragment,
  ErrorPolicyEnum,
  type ProductChannelListingErrorFragment,
  type ProductDetailsVariantFragment,
  type ProductErrorFragment,
  type ProductErrorWithAttributesFragment,
  type ProductFragment,
  type ProductVariantBulkCreateInput,
  type UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantBulkCreateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantBulkUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { dedupeBulkCreateInputs } from "@dashboard/products/hooks/variantGridStagedEdits";
import {
  getProductSubmitErrorNotificationMessages,
  splitProductSubmitErrors,
} from "@dashboard/products/utils/splitSubmitErrors";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  getCreateVariantMutationError,
  getVariantUpdateMutationErrors,
  type ProductVariantListError,
} from "./errors";
import {
  createInitialProductSaveSteps,
  hasFailedProductSaveStep,
  type ProductSaveStepResult,
  setProductSaveStepStatus,
} from "./productSaveSteps";
import {
  getBulkVariantUpdateInputs,
  getCreateVariantInput,
  getProductChannelsUpdateVariables,
  getProductUpdateVariables,
  hasProductChannelsUpdate,
} from "./utils";

export type UseProductUpdateHandlerError =
  | ProductErrorWithAttributesFragment
  | ProductErrorFragment
  | AttributeErrorFragment
  | UploadErrorFragment
  | ProductChannelListingErrorFragment
  | ProductVariantListError;

type UseProductUpdateHandler = (
  data: ProductUpdateSubmitData,
) => Promise<Array<UseProductUpdateHandlerError>>;

interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: ProductErrorWithAttributesFragment[];
  variantListErrors: ProductVariantListError[];
  channelsErrors: ProductChannelListingErrorFragment[];
  saveSteps: ProductSaveStepResult[];
  clearSaveSteps: () => void;
}

export function useProductUpdateHandler(
  product: ProductFragment | undefined,
  variants: ProductDetailsVariantFragment[] = [],
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();
  const [variantListErrors, setVariantListErrors] = useState<ProductVariantListError[]>([]);
  const [submitErrors, setSubmitErrors] = useState<ProductErrorWithAttributesFragment[]>([]);
  const [submitChannelsErrors, setSubmitChannelsErrors] = useState<
    ProductChannelListingErrorFragment[]
  >([]);
  const [saveSteps, setSaveSteps] = useState<ProductSaveStepResult[]>([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateVariants] = useProductVariantBulkUpdateMutation();
  const [createVariants] = useProductVariantBulkCreateMutation();
  const [deleteVariants] = useProductVariantBulkDeleteMutation();
  const [uploadFile] = useFileUploadMutation();
  const [updateProduct] = useProductUpdateMutation();
  const [updateChannels] = useProductChannelListingUpdateMutation();
  const [deleteAttributeValue] = useAttributeValueDeleteMutation();
  const clearSaveSteps = () => setSaveSteps([]);
  const sendMutations = async (
    data: ProductUpdateSubmitData,
  ): Promise<{ errors: UseProductUpdateHandlerError[]; steps: ProductSaveStepResult[] }> => {
    if (!product) {
      return { errors: [], steps: [] };
    }

    let errors: UseProductUpdateHandlerError[] = [];
    const variantErrors: ProductVariantListError[] = [];
    let steps = createInitialProductSaveSteps();
    const hasFileAttributeWork = data.attributesWithNewFileValue.length > 0;
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );
    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      variables => deleteAttributeValue({ variables }),
    );
    const fileErrors = [
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
    ];

    if (hasFileAttributeWork) {
      steps = setProductSaveStepStatus(steps, "files", fileErrors.length > 0 ? "error" : "success");
      errors = [...errors, ...fileErrors];
    }

    const updateProductChannelsData = getProductChannelsUpdateVariables(product, data);

    // Persist product fields (including category) before channel listing updates so
    // publish validation sees the latest saved product state in the same submit.
    const updateProductResult = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });
    const productUpdateErrors = updateProductResult?.data?.productUpdate?.errors ?? [];

    errors = [...errors, ...productUpdateErrors];
    steps = setProductSaveStepStatus(
      steps,
      "product",
      productUpdateErrors.length > 0 ? "error" : "success",
    );

    const shouldUpdateChannels =
      productUpdateErrors.length === 0 && hasProductChannelsUpdate(updateProductChannelsData.input);

    if (shouldUpdateChannels) {
      const updateChannelsResult = await updateChannels({
        variables: updateProductChannelsData,
      });
      const channelErrors = updateChannelsResult.data?.productChannelListingUpdate.errors ?? [];

      errors = [...errors, ...channelErrors];
      steps = setProductSaveStepStatus(
        steps,
        "channels",
        channelErrors.length > 0 ? "error" : "success",
      );
    } else if (hasProductChannelsUpdate(updateProductChannelsData.input)) {
      steps = setProductSaveStepStatus(steps, "channels", "skipped");
    }

    if (data.variants.removedVariantIds?.length || data.variants.removed.length > 0) {
      const idsFromIndexes = data.variants.removed
        .map(index => variants[index]?.id)
        .filter((id): id is string => Boolean(id));
      // Prefer staged cross-page ids; fall back / union with page-local indexes.
      const ids = Array.from(
        new Set([...(data.variants.removedVariantIds ?? []), ...idsFromIndexes]),
      );

      if (ids.length > 0) {
        const deleteVaraintsResult = await deleteVariants({
          variables: { ids },
        });
        const deleteErrors = deleteVaraintsResult.data?.productVariantBulkDelete.errors ?? [];

        errors = [...errors, ...deleteErrors];
        steps = setProductSaveStepStatus(
          steps,
          "variantDelete",
          deleteErrors.length > 0 ? "error" : "success",
        );
      }
    }

    if (data.variants.added.length > 0 || (data.variants.stagedCreates?.length ?? 0) > 0) {
      const fromGrid: ProductVariantBulkCreateInput[] = data.variants.added.map(index =>
        getCreateVariantInput(data.variants, index, product?.productType?.variantAttributes ?? []),
      );
      const stagedCreates = data.variants.stagedCreates ?? [];
      const { unique: createInputs } = dedupeBulkCreateInputs([...fromGrid, ...stagedCreates]);
      // Track each submitted input's origin (grid add vs staged create) so row-level
      // errors can be mapped back for precise retry trimming. Object identity is
      // stable: dedupe returns references to the original inputs.
      const createInputSources = createInputs.map(input => {
        const gridIndex = fromGrid.indexOf(input);

        return gridIndex !== -1 ? { gridIndex } : { stagedIndex: stagedCreates.indexOf(input) };
      });

      if (createInputs.length > 0) {
        const createVariantsResults = await createVariants({
          variables: {
            id: product.id,
            inputs: createInputs,
          },
        });
        const createVariantsErrors = getCreateVariantMutationError(
          createVariantsResults,
          createInputSources,
        );

        errors.push(...createVariantsErrors);
        variantErrors.push(...createVariantsErrors);
        steps = setProductSaveStepStatus(
          steps,
          "variantCreate",
          createVariantsErrors.length > 0 ? "error" : "success",
        );
      }
    }

    const updateChanges = data.variants.stagedUpdateChanges ?? data.variants;
    const variantsForBulkUpdate = data.variants.stagedUpdateVariants ?? variants;

    if (updateChanges.updates.length > 0) {
      const updateInputdData = getBulkVariantUpdateInputs(
        variantsForBulkUpdate,
        updateChanges,
        product?.productType?.variantAttributes ?? [],
      );

      if (updateInputdData.length) {
        // Chunk to stay within API comfort zone for large catalogs.
        const CHUNK_SIZE = 100;
        let updateFailed = false;

        for (let offset = 0; offset < updateInputdData.length; offset += CHUNK_SIZE) {
          const chunk = updateInputdData.slice(offset, offset + CHUNK_SIZE);
          const updateVariantsResults = await updateVariants({
            variables: {
              product: product.id,
              input: chunk,
              errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
            },
          });
          const updateVariantsErrors = getVariantUpdateMutationErrors(
            updateVariantsResults,
            chunk.map(row => row.id),
          );

          variantErrors.push(...updateVariantsErrors);
          errors.push(...updateVariantsErrors);

          if (updateVariantsErrors.length > 0) {
            updateFailed = true;
          }
        }

        steps = setProductSaveStepStatus(
          steps,
          "variantUpdate",
          updateFailed ? "error" : "success",
        );
      }
    }

    setVariantListErrors(variantErrors);

    return { errors, steps };
  };
  const submit = async (data: ProductUpdateSubmitData) => {
    if (!product) {
      return [];
    }

    setCalled(true);
    setLoading(true);
    setSubmitErrors([]);
    setSubmitChannelsErrors([]);
    setSaveSteps([]);

    const { errors, steps } = await sendMutations(data);

    setLoading(false);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "Ad9EZ1",
          defaultMessage: "Product updated",
        }),
      });
    } else {
      if (hasFailedProductSaveStep(steps)) {
        setSaveSteps(steps);
      }

      getProductSubmitErrorNotificationMessages(errors, intl).forEach(text =>
        notify({
          status: "error",
          text,
        }),
      );

      const { productErrors, channelsErrors } = splitProductSubmitErrors(errors);

      setSubmitErrors(productErrors);
      setSubmitChannelsErrors(channelsErrors);
    }

    return errors;
  };

  return [
    submit,
    {
      called,
      loading,
      channelsErrors: submitChannelsErrors,
      errors: submitErrors,
      variantListErrors,
      saveSteps,
      clearSaveSteps,
    },
  ];
}
