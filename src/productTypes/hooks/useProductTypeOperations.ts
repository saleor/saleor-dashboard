import {
  AssignProductAttributeMutation,
  ProductAttributeType,
  ProductTypeAttributeReorderMutation,
  ProductTypeDeleteMutation,
  ProductTypeDetailsFragment,
  ReorderInput,
  UnassignProductAttributeMutation,
  useAssignProductAttributeMutation,
  useProductTypeAttributeReorderMutation,
  useProductTypeDeleteMutation,
  useUnassignProductAttributeMutation,
} from "@saleor/graphql";

import { getMutationProviderData } from "../../misc";

function moveAttribute(
  attributes: ProductTypeDetailsFragment["productAttributes"],
  move: ReorderInput,
) {
  const attributeIndex = attributes.findIndex(
    attribute => attribute.id === move.id,
  );
  const newIndex = attributeIndex + move.sortOrder;

  const attributesWithoutMovedOne = [
    ...attributes.slice(0, attributeIndex),
    ...attributes.slice(attributeIndex + 1),
  ];

  return [
    ...attributesWithoutMovedOne.slice(0, newIndex),
    attributes[attributeIndex],
    ...attributesWithoutMovedOne.slice(newIndex),
  ];
}

interface ProductTypeOperationsProps {
  productType: ProductTypeDetailsFragment;
  onAssignAttribute: (data: AssignProductAttributeMutation) => void;
  onUnassignAttribute: (data: UnassignProductAttributeMutation) => void;
  onProductTypeAttributeReorder: (
    data: ProductTypeAttributeReorderMutation,
  ) => void;
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
    optimisticResponse: variables => ({
      __typename: "Mutation",
      productTypeReorderAttributes: {
        __typename: "ProductTypeReorderAttributes" as "ProductTypeReorderAttributes",
        errors: [],
        productType: {
          ...productType,
          productAttributes:
            variables.type === ProductAttributeType.PRODUCT
              ? moveAttribute(productType.productAttributes, variables.move)
              : productType.productAttributes,
          variantAttributes:
            variables.type === ProductAttributeType.VARIANT
              ? moveAttribute(productType.variantAttributes, variables.move)
              : productType.variantAttributes,
        },
      },
    }),
  });

  return {
    assignAttribute: getMutationProviderData(...assignAttribute),
    deleteProductType: getMutationProviderData(...deleteProductType),
    reorderAttribute: getMutationProviderData(...reorderAttribute),
    unassignAttribute: getMutationProviderData(...unassignAttribute),
  };
}

export default useProductTypeOperations;
