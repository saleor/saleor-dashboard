import {
  ProductTypeDetailsFragment,
  ProductTypeDetailsFragment_productAttributes
} from "@saleor/fragments/types/ProductTypeDetailsFragment";
import { AttributeTypeEnum, ReorderInput } from "@saleor/types/globalTypes";
import React from "react";
import { MutationFunction } from "react-apollo";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  ProductTypeAttributeReorderMutation,
  TypedAssignAttributeMutation,
  TypedProductTypeDeleteMutation,
  TypedUnassignAttributeMutation
} from "../mutations";
import {
  AssignAttribute,
  AssignAttributeVariables
} from "../types/AssignAttribute";
import {
  ProductTypeAttributeReorder,
  ProductTypeAttributeReorderVariables
} from "../types/ProductTypeAttributeReorder";
import {
  ProductTypeDelete,
  ProductTypeDeleteVariables
} from "../types/ProductTypeDelete";
import {
  UnassignAttribute,
  UnassignAttributeVariables
} from "../types/UnassignAttribute";

function moveAttribute(
  attributes: ProductTypeDetailsFragment_productAttributes[],
  move: ReorderInput
) {
  const attributeIndex = attributes.findIndex(
    attribute => attribute.id === move.id
  );
  const newIndex = attributeIndex + move.sortOrder;

  const attributesWithoutMovedOne = [
    ...attributes.slice(0, attributeIndex),
    ...attributes.slice(attributeIndex + 1)
  ];

  return [
    ...attributesWithoutMovedOne.slice(0, newIndex),
    attributes[attributeIndex],
    ...attributesWithoutMovedOne.slice(newIndex)
  ];
}

interface ProductTypeOperationsProps {
  children: (props: {
    assignAttribute: PartialMutationProviderOutput<
      AssignAttribute,
      AssignAttributeVariables
    >;
    unassignAttribute: PartialMutationProviderOutput<
      UnassignAttribute,
      UnassignAttributeVariables
    >;
    deleteProductType: PartialMutationProviderOutput<
      ProductTypeDelete,
      ProductTypeDeleteVariables
    >;
    reorderAttribute: PartialMutationProviderOutput<
      ProductTypeAttributeReorder,
      ProductTypeAttributeReorderVariables
    >;
  }) => React.ReactNode;
  productType: ProductTypeDetailsFragment;
  onAssignAttribute: (data: AssignAttribute) => void;
  onUnassignAttribute: (data: UnassignAttribute) => void;
  onProductTypeAttributeReorder: (data: ProductTypeAttributeReorder) => void;
  onProductTypeDelete: (data: ProductTypeDelete) => void;
}

const ProductTypeOperations: React.FC<ProductTypeOperationsProps> = ({
  children,
  productType,
  onAssignAttribute,
  onUnassignAttribute,
  onProductTypeAttributeReorder,
  onProductTypeDelete
}) => (
  <TypedProductTypeDeleteMutation onCompleted={onProductTypeDelete}>
    {(...deleteProductType) => (
      <TypedAssignAttributeMutation onCompleted={onAssignAttribute}>
        {(...assignAttribute) => (
          <TypedUnassignAttributeMutation onCompleted={onUnassignAttribute}>
            {(...unassignAttribute) => (
              <ProductTypeAttributeReorderMutation
                onCompleted={onProductTypeAttributeReorder}
              >
                {(reorderAttributeMutation, reorderAttributeMutationResult) => {
                  const reorderAttributeMutationFn: MutationFunction<
                    ProductTypeAttributeReorder,
                    ProductTypeAttributeReorderVariables
                  > = opts => {
                    const optimisticResponse: ProductTypeAttributeReorder = {
                      productTypeReorderAttributes: {
                        __typename: "ProductTypeReorderAttributes" as "ProductTypeReorderAttributes",
                        errors: [],
                        productType: {
                          ...productType,
                          productAttributes:
                            opts.variables.type === AttributeTypeEnum.PRODUCT
                              ? moveAttribute(
                                  productType.productAttributes,
                                  opts.variables.move
                                )
                              : productType.productAttributes,
                          variantAttributes:
                            opts.variables.type === AttributeTypeEnum.VARIANT
                              ? moveAttribute(
                                  productType.variantAttributes,
                                  opts.variables.move
                                )
                              : productType.variantAttributes
                        }
                      }
                    };
                    return reorderAttributeMutation({
                      ...opts,
                      optimisticResponse
                    });
                  };

                  return children({
                    assignAttribute: getMutationProviderData(
                      ...assignAttribute
                    ),
                    deleteProductType: getMutationProviderData(
                      ...deleteProductType
                    ),
                    reorderAttribute: getMutationProviderData(
                      reorderAttributeMutationFn,
                      reorderAttributeMutationResult
                    ),
                    unassignAttribute: getMutationProviderData(
                      ...unassignAttribute
                    )
                  });
                }}
              </ProductTypeAttributeReorderMutation>
            )}
          </TypedUnassignAttributeMutation>
        )}
      </TypedAssignAttributeMutation>
    )}
  </TypedProductTypeDeleteMutation>
);
export default ProductTypeOperations;
