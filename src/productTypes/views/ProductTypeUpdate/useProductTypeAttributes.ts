import { AvailableAttributeFragment } from "@saleor/graphql";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { toggle as toggleInList } from "@saleor/utils/lists";
import differenceBy from "lodash/differenceBy";

type ProductTypeAttribute = "productAttributes" | "variantAttributes";

const defaultState = {
  productAttributes: [],
  variantAttributes: []
};

function useProductTypeAttributes(
  initial: Record<ProductTypeAttribute, AvailableAttributeFragment[]>
) {
  const [attributes, setAttributes] = useStateFromProps<
    Record<ProductTypeAttribute, AvailableAttributeFragment[]>
  >(initial ?? defaultState);

  const toggle = (
    ids: AvailableAttributeFragment[],
    type: ProductTypeAttribute
  ) =>
    setAttributes(prevAttributes => ({
      ...prevAttributes,
      [type]: ids.reduce(
        (acc, id) => toggleInList(id, acc, (a, b) => a.id === b.id),
        prevAttributes[type]
      )
    }));

  return {
    attributes,
    toggle,
    diff: {
      productAttributes: {
        added: differenceBy(
          attributes.productAttributes,
          initial?.productAttributes,
          "id"
        ),
        removed: differenceBy(
          initial?.productAttributes,
          attributes.productAttributes,
          "id"
        )
      },
      variantAttributes: {
        added: differenceBy(
          attributes.variantAttributes,
          initial?.variantAttributes,
          "id"
        ),
        removed: differenceBy(
          initial?.variantAttributes,
          attributes.variantAttributes,
          "id"
        )
      }
    }
  };
}

export default useProductTypeAttributes;
