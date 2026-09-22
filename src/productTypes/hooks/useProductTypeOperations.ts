// @ts-strict-ignore
import {
  type AssignProductAttributeMutation,
  ProductAttributeType,
  type ProductTypeAttributeReorderMutation,
  type ProductTypeDeleteMutation,
  type ProductTypeDetailsFragment,
  type UnassignProductAttributeMutation,
  useAssignProductAttributeMutation,
  useProductTypeAttributeReorderMutation,
  useProductTypeDeleteMutation,
  useUnassignProductAttributeMutation,
} from "@dashboard/graphql";

import { getMutationProviderData } from "../../misc";
import { moveListItem } from "../utils/moveListItem";

interface ProductTypeOperationsProps {
  productType: ProductTypeDetailsFragment;
  onAssignAttribute: (data: AssignProductAttributeMutation) => void;
  onUnassignAttribute: (data: UnassignProductAttributeMutation) => void;
  onProductTypeAttributeReorder: (data: ProductTypeAttributeReorderMutation) => void;
  onProductTypeDelete: (data: ProductTypeDeleteMutation) => void;
}

function useProductTypeOperations({
  onAssignAttribute,
  onProductTypeAttributeReorder,
  onProductTypeDelete,
  onUnassignAttribute,
  productType,
}: ProductTypeOperationsProps) {
  const deleteProductType = useProductTypeDeleteMutation({
    onCompleted: onProductTypeDelete,
  });
  const assignAttribute = useAssignProductAttributeMutation({
    onCompleted: onAssignAttribute,
  });
  const unassignAttribute = useUnassignProductAttributeMutation({
    onCompleted: onUnassignAttribute,
  });
  const [...reorderAttribute] = useProductTypeAttributeReorderMutation({
    onCompleted: onProductTypeAttributeReorder,
    optimisticResponse: variables => {
      if (!productType) {
        return {
          __typename: "Mutation" as const,
          productTypeReorderAttributes: {
            __typename: "ProductTypeReorderAttributes" as const,
            errors: [],
            productType: null,
          },
        };
      }

      const isProduct = variables.type === ProductAttributeType.PRODUCT;

      return {
        __typename: "Mutation" as const,
        productTypeReorderAttributes: {
          __typename: "ProductTypeReorderAttributes" as const,
          errors: [],
          productType: {
            ...productType,
            productAttributes: isProduct
              ? moveListItem(
                  productType.productAttributes,
                  variables.move,
                  attribute => attribute.id,
                )
              : productType.productAttributes,
            variantAttributes: isProduct
              ? productType.variantAttributes
              : moveListItem(
                  productType.variantAttributes,
                  variables.move,
                  attribute => attribute.id,
                ),
            assignedVariantAttributes: isProduct
              ? productType.assignedVariantAttributes
              : moveListItem(
                  productType.assignedVariantAttributes,
                  variables.move,
                  assigned => assigned.attribute.id,
                ),
          },
        },
      };
    },
  });

  return {
    assignAttribute: getMutationProviderData(...assignAttribute),
    deleteProductType: getMutationProviderData(...deleteProductType),
    reorderAttribute: getMutationProviderData(...reorderAttribute),
    unassignAttribute: getMutationProviderData(...unassignAttribute),
  };
}

export default useProductTypeOperations;
