import React from "react";

import { getMutationProviderData, maybe } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedProductDeleteMutation,
  TypedProductImageCreateMutation,
  TypedProductImageDeleteMutation,
  TypedProductUpdateMutation,
  TypedProductVariantBulkCreateMutation,
  TypedProductVariantBulkDeleteMutation,
  TypedSimpleProductUpdateMutation
} from "../mutations";
import { ProductDelete, ProductDeleteVariables } from "../types/ProductDelete";
import { ProductDetails_product } from "../types/ProductDetails";
import {
  ProductImageCreate,
  ProductImageCreateVariables
} from "../types/ProductImageCreate";
import {
  ProductImageDelete,
  ProductImageDeleteVariables
} from "../types/ProductImageDelete";
import {
  ProductImageReorder,
  ProductImageReorderVariables
} from "../types/ProductImageReorder";
import { ProductUpdate, ProductUpdateVariables } from "../types/ProductUpdate";
import {
  ProductVariantBulkCreate,
  ProductVariantBulkCreateVariables
} from "../types/ProductVariantBulkCreate";
import {
  ProductVariantBulkDelete,
  ProductVariantBulkDeleteVariables
} from "../types/ProductVariantBulkDelete";
import {
  SimpleProductUpdate,
  SimpleProductUpdateVariables
} from "../types/SimpleProductUpdate";
import ProductImagesReorderProvider from "./ProductImagesReorder";

interface ProductUpdateOperationsProps {
  product: ProductDetails_product;
  children: (props: {
    bulkProductVariantCreate: PartialMutationProviderOutput<
      ProductVariantBulkCreate,
      ProductVariantBulkCreateVariables
    >;
    bulkProductVariantDelete: PartialMutationProviderOutput<
      ProductVariantBulkDelete,
      ProductVariantBulkDeleteVariables
    >;
    createProductImage: PartialMutationProviderOutput<
      ProductImageCreate,
      ProductImageCreateVariables
    >;
    deleteProduct: PartialMutationProviderOutput<
      ProductDelete,
      ProductDeleteVariables
    >;
    deleteProductImage: PartialMutationProviderOutput<
      ProductImageDelete,
      ProductImageDeleteVariables
    >;
    reorderProductImages: PartialMutationProviderOutput<
      ProductImageReorder,
      ProductImageReorderVariables
    >;
    updateProduct: PartialMutationProviderOutput<
      ProductUpdate,
      ProductUpdateVariables
    >;
    updateSimpleProduct: PartialMutationProviderOutput<
      SimpleProductUpdate,
      SimpleProductUpdateVariables
    >;
  }) => React.ReactNode;
  onBulkProductVariantCreate?: (data: ProductVariantBulkCreate) => void;
  onBulkProductVariantDelete?: (data: ProductVariantBulkDelete) => void;
  onDelete?: (data: ProductDelete) => void;
  onImageCreate?: (data: ProductImageCreate) => void;
  onImageDelete?: (data: ProductImageDelete) => void;
  onImageReorder?: (data: ProductImageReorder) => void;
  onUpdate?: (data: ProductUpdate) => void;
}

const ProductUpdateOperations: React.StatelessComponent<
  ProductUpdateOperationsProps
> = ({
  product,
  children,
  onBulkProductVariantCreate,
  onBulkProductVariantDelete,
  onDelete,
  onImageDelete,
  onImageCreate,
  onImageReorder,
  onUpdate
}) => {
  const productId = product ? product.id : "";
  return (
    <TypedProductUpdateMutation onCompleted={onUpdate}>
      {(...updateProduct) => (
        <ProductImagesReorderProvider
          productId={productId}
          productImages={maybe(() => product.images, [])}
          onCompleted={onImageReorder}
        >
          {(...reorderProductImages) => (
            <TypedProductImageCreateMutation onCompleted={onImageCreate}>
              {(...createProductImage) => (
                <TypedProductDeleteMutation onCompleted={onDelete}>
                  {(...deleteProduct) => (
                    <TypedProductImageDeleteMutation
                      onCompleted={onImageDelete}
                    >
                      {(...deleteProductImage) => (
                        <TypedSimpleProductUpdateMutation
                          onCompleted={onUpdate}
                        >
                          {(...updateSimpleProduct) => (
                            <TypedProductVariantBulkDeleteMutation
                              onCompleted={onBulkProductVariantDelete}
                            >
                              {(...bulkProductVariantDelete) => (
                                <TypedProductVariantBulkCreateMutation
                                  onCompleted={onBulkProductVariantCreate}
                                >
                                  {(...bulkProductVariantCreate) =>
                                    children({
                                      bulkProductVariantCreate: getMutationProviderData(
                                        ...bulkProductVariantCreate
                                      ),
                                      bulkProductVariantDelete: getMutationProviderData(
                                        ...bulkProductVariantDelete
                                      ),
                                      createProductImage: getMutationProviderData(
                                        ...createProductImage
                                      ),
                                      deleteProduct: getMutationProviderData(
                                        ...deleteProduct
                                      ),
                                      deleteProductImage: getMutationProviderData(
                                        ...deleteProductImage
                                      ),
                                      reorderProductImages: getMutationProviderData(
                                        ...reorderProductImages
                                      ),
                                      updateProduct: getMutationProviderData(
                                        ...updateProduct
                                      ),
                                      updateSimpleProduct: getMutationProviderData(
                                        ...updateSimpleProduct
                                      )
                                    })
                                  }
                                </TypedProductVariantBulkCreateMutation>
                              )}
                            </TypedProductVariantBulkDeleteMutation>
                          )}
                        </TypedSimpleProductUpdateMutation>
                      )}
                    </TypedProductImageDeleteMutation>
                  )}
                </TypedProductDeleteMutation>
              )}
            </TypedProductImageCreateMutation>
          )}
        </ProductImagesReorderProvider>
      )}
    </TypedProductUpdateMutation>
  );
};
export default ProductUpdateOperations;
