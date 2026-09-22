import { type FetchResult } from "@apollo/client";
import { VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductCreateMutation,
  type ProductCreateMutationVariables,
  type ProductDeleteMutation,
  type ProductDeleteMutationVariables,
  type ProductErrorWithAttributesFragment,
  type VariantCreateMutation,
  type VariantCreateMutationVariables,
} from "@dashboard/graphql";
import { getMutationErrors } from "@dashboard/misc";

interface CreateMinimalProductParams {
  name: string;
  productTypeId: string;
  hasVariants: boolean;
  productCreate: (
    variables: ProductCreateMutationVariables,
  ) => Promise<FetchResult<ProductCreateMutation>>;
  productVariantCreate: (
    variables: VariantCreateMutationVariables,
  ) => Promise<FetchResult<VariantCreateMutation>>;
  productDelete: (
    variables: ProductDeleteMutationVariables,
  ) => Promise<FetchResult<ProductDeleteMutation>>;
}

interface CreateMinimalProductResult {
  productId: string | null;
  errors: ProductErrorWithAttributesFragment[];
}

/**
 * Creates a product with name + type only. Simple product types get a bare
 * default variant named after the product so the detail page can take price
 * and stock. Channel listings, category, and SEO stay on the product detail
 * checklist.
 */
export const createMinimalProduct = async ({
  name,
  productTypeId,
  hasVariants,
  productCreate,
  productVariantCreate,
  productDelete,
}: CreateMinimalProductParams): Promise<CreateMinimalProductResult> => {
  const createResult = await productCreate({
    input: {
      name,
      productType: productTypeId,
    },
  });
  const createErrors = getMutationErrors(createResult) as ProductErrorWithAttributesFragment[];
  const productId = createResult.data?.productCreate?.product?.id ?? null;

  if (createErrors.length > 0 || !productId) {
    return { productId: null, errors: createErrors };
  }

  if (hasVariants) {
    return { productId, errors: [] };
  }

  const variantResult = await productVariantCreate({
    input: {
      attributes: [],
      name,
      product: productId,
    },
    firstValues: VALUES_PAGINATE_BY,
  });
  const variantErrors = getMutationErrors(variantResult) as ProductErrorWithAttributesFragment[];

  if (variantErrors.length > 0) {
    await productDelete({ id: productId });

    return { productId: null, errors: variantErrors };
  }

  return { productId, errors: [] };
};
