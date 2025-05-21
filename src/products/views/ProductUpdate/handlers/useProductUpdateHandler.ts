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
  AttributeErrorFragment,
  ErrorPolicyEnum,
  MetadataErrorFragment,
  ProductChannelListingErrorFragment,
  ProductErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantBulkCreateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantBulkUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import {
  ProductMaterialEnum,
  ProductMaterialError,
  ProductMaterialErrorCode,
  ProductMaterialsComposition,
} from "@dashboard/products/components/ProductUpdatePage/ProductMaterialsListCard/types";
import { getMaterialCompositionRowId } from "@dashboard/products/components/ProductUpdatePage/ProductMaterialsListCard/utils";
import {
  ClothingSize,
  ProductSizeErrorCode,
  ProductSizeTableError,
  SizePropertyEnum,
  TSizeTable,
} from "@dashboard/products/components/ProductUpdatePage/ProductSizeTableCard/types";
import { mapSizePropertyToMessage } from "@dashboard/products/components/ProductUpdatePage/ProductSizeTableCard/utils";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";

import {
  getCreateVariantMutationError,
  getVariantUpdateMutationErrors,
  ProductVariantListError,
} from "./errors";
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
  | ProductVariantListError
  | ProductMaterialError
  | ProductSizeTableError;

type UseProductUpdateHandler = (
  data: ProductUpdateSubmitData,
) => Promise<Array<UseProductUpdateHandlerError | MetadataErrorFragment>>;

interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: ProductErrorWithAttributesFragment[];
  variantListErrors: ProductVariantListError[];
  channelsErrors: ProductChannelListingErrorFragment[];
  customErrors?: Array<UseProductUpdateHandlerError>;
  productSizeTableErrors: ProductSizeTableError[];
}

export function useProductUpdateHandler(
  product: ProductFragment,
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();
  const [variantListErrors, setVariantListErrors] = useState<ProductVariantListError[]>([]);
  const [productSizeTableErrors, setProductSizeTableErrors] = useState<ProductSizeTableError[]>([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [updateVariants] = useProductVariantBulkUpdateMutation();
  const [createVariants] = useProductVariantBulkCreateMutation();
  const [deleteVariants] = useProductVariantBulkDeleteMutation();
  const [uploadFile] = useFileUploadMutation();
  const [updateProduct, updateProductOpts] = useProductUpdateMutation();
  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdateMutation({
    onCompleted: data => {
      if (data.productChannelListingUpdate.errors.length) {
        data.productChannelListingUpdate.errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const [deleteAttributeValue] = useAttributeValueDeleteMutation();
  const [customErrors, setCustomErrors] = useState<UseProductUpdateHandlerError[]>([]);
  const sendMutations = async (
    data: ProductUpdateSubmitData,
  ): Promise<UseProductUpdateHandlerError[]> => {
    // reset old errors
    setCustomErrors([]);

    let errors: UseProductUpdateHandlerError[] = [];
    const variantErrors: ProductVariantListError[] = [];
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );
    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      variables => deleteAttributeValue({ variables }),
    );
    const updateProductChannelsData = getProductChannelsUpdateVariables(product, data);

    if (hasProductChannelsUpdate(updateProductChannelsData.input)) {
      const updateChannelsResult = await updateChannels({
        variables: updateProductChannelsData,
      });

      if (updateChannelsResult.data) {
        errors = [...errors, ...updateChannelsResult.data.productChannelListingUpdate.errors];
      }
    }

    if (data.variants.removed.length > 0) {
      const deleteVaraintsResult = await deleteVariants({
        variables: {
          ids: data.variants.removed.map(index => product.variants[index].id),
        },
      });

      errors = [...errors, ...deleteVaraintsResult.data.productVariantBulkDelete.errors];
    }

    const productMaterialErrors = handleMaterialCompositionUpdate(intl, data.materialsComposition);

    if (productMaterialErrors.length) {
      productMaterialErrors.forEach(error =>
        notify({
          status: "error",
          text: error.message,
        }),
      );
      errors.push(...productMaterialErrors);
      setCustomErrors(errs => [...errs, ...productMaterialErrors]);

      return errors;
    }

    const productSizeTableErrors = getSizeTableErrors(intl, data.sizeTable);

    if (productSizeTableErrors.length) {
      productSizeTableErrors.forEach(error =>
        notify({
          status: "error",
          text: error.message,
        }),
      );
      errors.push(...productSizeTableErrors);
      setCustomErrors(errs => [...errs, ...productSizeTableErrors]);
      setProductSizeTableErrors(productSizeTableErrors);

      // return errors;
    }

    const updateProductResult = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });

    if (data.variants.added.length > 0) {
      const createVariantsResults = await createVariants({
        variables: {
          id: product.id,
          inputs: data.variants.added.map(index => ({
            ...getCreateVariantInput(
              data.variants,
              index,
              product?.productType?.variantAttributes ?? [],
            ),
          })),
        },
      });
      const createVariantsErrors = getCreateVariantMutationError(createVariantsResults);

      errors.push(...createVariantsErrors);
      variantErrors.push(...createVariantsErrors);
    }

    if (data.variants.updates.length > 0) {
      const updateInputdData = getBulkVariantUpdateInputs(
        product.variants,
        data.variants,
        product?.productType?.variantAttributes ?? [],
      );

      if (updateInputdData.length) {
        const updateVariantsResults = await updateVariants({
          variables: {
            product: product.id,
            input: updateInputdData,
            errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
          },
        });
        const updateVariantsErrors = getVariantUpdateMutationErrors(
          updateVariantsResults,
          updateInputdData.map(data => data.id),
        );

        variantErrors.push(...updateVariantsErrors);
        errors.push(...updateVariantsErrors);
      }
    }

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
      ...(updateProductResult?.data?.productUpdate?.errors ?? []),
    ];
    setVariantListErrors(variantErrors);

    return errors;
  };
  const submit = async (data: ProductUpdateSubmitData) => {
    setCalled(true);
    setLoading(true);

    const errors = await createMetadataUpdateHandler(
      product,
      sendMutations,
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    )(data);

    setLoading(false);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }

    return errors;
  };
  const errors = getMutationErrors(updateProductOpts) as ProductErrorWithAttributesFragment[];
  const channelsErrors = updateChannelsOpts?.data?.productChannelListingUpdate?.errors ?? [];

  return [
    submit,
    {
      called,
      loading,
      channelsErrors,
      errors,
      variantListErrors,
      customErrors,
      productSizeTableErrors,
    },
  ];
}

const getSizeTableErrors = (
  // product: ProductFragment,
  intl: IntlShape,
  currentSizeTable: TSizeTable,
): ProductSizeTableError[] => {
  // const productVariantClothingSizes = getProductVariantClothingSizes(product.variants);

  const errors: ProductSizeTableError[] = [];

  Object.keys(currentSizeTable).forEach(size => {
    if (currentSizeTable[size] === undefined) {
      // if size undefined it's not in the table
      return;
    }

    const sizeTableRow = currentSizeTable[size as ClothingSize];

    Object.entries(sizeTableRow).forEach(([property, value]) => {
      if (!value) {
        errors.push({
          __typename: "ProductSizeTableError",
          code: ProductSizeErrorCode.REQUIRED,
          field: property as SizePropertyEnum,
          size: size as ClothingSize,
          message: `${intl.formatMessage({
            defaultMessage: "Size table value is required",
            id: "QdhgFO",
          })},
          ${intl.formatMessage({ defaultMessage: "size", id: "oqi+AF" })}: ${size.toUpperCase()},
          ${intl.formatMessage({ defaultMessage: "dimension", id: "2nHvaR" })}: ${mapSizePropertyToMessage(property as SizePropertyEnum, intl)}`,
        });
      }
    });
  });

  // if (sizeTableChangeOpts.updates.length > 0) {
  //   const newSizeTable: TSizeTable = initSizeTable ? { ...initSizeTable } : {};

  //   sizeTableChangeOpts.updates.forEach(update => {
  //     if (update.column in SizePropertyEnum) {
  //       const property = update.column as SizePropertyEnum;
  //       const value = update.data.value;
  //       const size = productVariantClothingSizes[update.row];

  //       if (!value) {
  //         errors.push({
  //           __typename: "ProductSizeTableError",
  //           code: ProductSizeErrorCode.REQUIRED,
  //           field: property,
  //           size,
  //         });

  //         return;
  //       }

  //       if (newSizeTable[size] === undefined) {
  //         newSizeTable[size] = { [property]: value };
  //       } else {
  //         newSizeTable[size][property] = value;
  //       }
  //     }
  //   });

  //   return [newSizeTable, errors];
  // }

  return errors;
};

const handleMaterialCompositionUpdate = (
  intl: IntlShape,
  materialsComposition: ProductMaterialsComposition,
) => {
  const productMaterialErrors: ProductMaterialError[] = [];

  // check if at least one material has been selected
  if (Object.keys(materialsComposition).length === 0) {
    productMaterialErrors.push({
      __typename: "ProductMaterialError",
      message: intl.formatMessage({
        defaultMessage: "Product material has not been selected",
        id: "8K+SMr",
      }),
      code: ProductMaterialErrorCode.NO_MATERIAL_PROVIDED,
      field: "material",
    });

    return productMaterialErrors;
  }

  // check if none of values are empty
  Object.entries(materialsComposition).forEach(([material, value]) => {
    if (!value) {
      const field = getMaterialCompositionRowId(
        ProductMaterialEnum[material as keyof typeof ProductMaterialEnum],
      );

      productMaterialErrors.push({
        __typename: "ProductMaterialError",
        message: intl.formatMessage({
          defaultMessage: "Material composition is required",
          id: "RJ4E+E",
        }),
        code: ProductMaterialErrorCode.EMPTY_PERCENTAGE_VALUE,
        field,
      });
    }
  });

  if (productMaterialErrors.length) return productMaterialErrors;

  // check if sum is equal to 100%
  const sum = Object.values(materialsComposition).reduce(
    (acc, value) => acc + (value ? parseFloat(value) : 0),
    0,
  );

  if (sum !== 100) {
    productMaterialErrors.push({
      __typename: "ProductMaterialError",
      message: intl.formatMessage({
        defaultMessage: "Sum of material composition must be 100%",
        id: "DrMu0f",
      }),
      code: ProductMaterialErrorCode.INVALID_PERCENTAGE,
      field: "material",
    });

    return productMaterialErrors;
  }

  // update request

  return [];
};
