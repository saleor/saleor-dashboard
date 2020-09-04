import { WindowTitle } from "@saleor/components/WindowTitle";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { useProductVariantBulkCreateMutation } from "@saleor/products/mutations";
import { useCreateMultipleVariantsData } from "@saleor/products/queries";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { productUrl } from "@saleor/products/urls";
import React from "react";
import { useIntl } from "react-intl";

import ProductVariantCreatorPage from "../../components/ProductVariantCreatorPage";

interface ProductVariantCreatorProps {
  id: string;
}

const ProductVariantCreator: React.FC<ProductVariantCreatorProps> = ({
  id
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { data } = useCreateMultipleVariantsData({
    displayLoader: true,
    variables: { id }
  });
  const [
    bulkProductVariantCreate,
    bulkProductVariantCreateOpts
  ] = useProductVariantBulkCreateMutation({
    onCompleted: data => {
      if (data.productVariantBulkCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Successfully created variants",
            description: "success message"
          })
        });
        navigate(productUrl(id));
      }
    }
  });

  const { isSelected, listElements, set, toggle } = useListActions(
    data?.product?.productType?.variantAttributes?.map(
      attribute => attribute.id
    ) || []
  );
  const toggleAll = (
    items: ProductDetails_product_productType_variantAttributes[],
    selected: number
  ) => {
    const allItems = items.map(item => item.id);
    const requiredItems = items.filter(item => !!item.valueRequired);
    if (selected !== allItems.length) {
      set(allItems);
    } else {
      set(requiredItems.map(item => item.id));
    }
  };
  const shop = useShop();

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create Variants",
          description: "window title"
        })}
      />
      <ProductVariantCreatorPage
        defaultPrice={data?.product?.pricing?.priceRangeUndiscounted?.start?.gross.amount.toString()}
        errors={
          bulkProductVariantCreateOpts.data?.productVariantBulkCreate.errors ||
          []
        }
        attributes={data?.product?.productType?.variantAttributes || []}
        currencySymbol={shop?.defaultCurrency}
        onSubmit={inputs =>
          bulkProductVariantCreate({
            variables: { id, inputs }
          })
        }
        warehouses={data?.warehouses.edges.map(edge => edge.node) || []}
        isChecked={isSelected}
        attributesListElements={listElements}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
      />
    </>
  );
};
ProductVariantCreator.displayName = "ProductVariantCreator";
export default ProductVariantCreator;
