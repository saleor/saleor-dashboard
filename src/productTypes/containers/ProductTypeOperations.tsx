import {
  ProductTypeDetailsFragment,
  ProductTypeDetailsFragment_productAttributes
} from "@saleor/fragments/types/ProductTypeDetailsFragment";
import { ProductAttributeType, ReorderInput } from "@saleor/types/globalTypes";
import React from "react";
import { MutationFunction } from "react-apollo";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  ProductTypeAttributeReorderMutation,
  TypedAssignProductAttributeMutation,
  TypedProductTypeDeleteMutation,
  TypedUnassignProductAttributeMutation
} from "../mutations";
import {
  AssignProductAttribute,
  AssignProductAttributeVariables
} from "../types/AssignProductAttribute";
import {
  ProductTypeAttributeReorder,
  ProductTypeAttributeReorderVariables
} from "../types/ProductTypeAttributeReorder";
import {
  ProductTypeDelete,
  ProductTypeDeleteVariables
} from "../types/ProductTypeDelete";
import {
  UnassignProductAttribute,
  UnassignProductAttributeVariables
} from "../types/UnassignProductAttribute";

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
      AssignProductAttribute,
      AssignProductAttributeVariables
    >;
    unassignAttribute: PartialMutationProviderOutput<
      UnassignProductAttribute,
      UnassignProductAttributeVariables
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
  onAssignAttribute: (data: AssignProductAttribute) => void;
  onUnassignAttribute: (data: UnassignProductAttribute) => void;
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
      <TypedAssignProductAttributeMutation onCompleted={onAssignAttribute}>
        {(...assignAttribute) => (
          <TypedUnassignProductAttributeMutation
            onCompleted={onUnassignAttribute}
          >
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
                            opts.variables.type === ProductAttributeType.PRODUCT
                              ? moveAttribute(
                                  productType.productAttributes,
                                  opts.variables.move
                                )
                              : productType.productAttributes,
                          variantAttributes:
                            opts.variables.type === ProductAttributeType.VARIANT
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
          </TypedUnassignProductAttributeMutation>
        )}
      </TypedAssignProductAttributeMutation>
    )}
  </TypedProductTypeDeleteMutation>
);
export default ProductTypeOperations;
