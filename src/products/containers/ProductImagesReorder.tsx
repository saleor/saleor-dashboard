import React from "react";

import { TypedMutationInnerProps } from "../../mutations";
import { useProductMediaReorder } from "../mutations";
import {
  ProductMediaReorder,
  ProductMediaReorderVariables
} from "../types/ProductMediaReorder";

interface ProductMediaReorderProviderProps
  extends TypedMutationInnerProps<
    ProductMediaReorder,
    ProductMediaReorderVariables
  > {
  productId: string;
  productMedia: Array<{
    id: string;
    url: string;
  }>;
}

const ProductMediaReorderProvider: React.FC<ProductMediaReorderProviderProps> = ({
  children,
  productId,
  productMedia,
  ...mutationProps
}) => {
  const [mutate, mutationResult] = useProductMediaReorder(mutationProps);

  return (
    <>
      {children(opts => {
        const productMediaMap = productMedia.reduce((prev, curr) => {
          prev[curr.id] = curr;
          return prev;
        }, {});
        const newProductMedia = opts.variables.mediaIds.map((id, index) => ({
          __typename: "ProductMedia",
          ...productMediaMap[id],
          sortOrder: index
        }));
        const optimisticResponse: typeof mutationResult["data"] = {
          productMediaReorder: {
            __typename: "ProductMediaReorder",
            errors: null,
            product: {
              __typename: "Product",
              id: productId,
              media: newProductMedia
            }
          }
        };

        return mutate({
          ...opts,
          optimisticResponse
        });
      }, mutationResult)}
    </>
  );
};

export default ProductMediaReorderProvider;
