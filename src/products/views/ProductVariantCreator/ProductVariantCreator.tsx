import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { useProductVariantBulkCreateMutation } from "@saleor/products/mutations";
import { useCreateMultipleVariantsData } from "@saleor/products/queries";
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
  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    data?.product?.productType?.variantAttributes?.map(
      attribute => attribute.id
    ) || []
  );
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
        availableAttributes={[
          ...(data?.product?.productType?.availableAttributes?.edges.map(
            edge => edge.node
          ) || []),
          ...(data?.product?.productType?.variantAttributes || [])
        ]}
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
        toolbar={null}
        toggle={toggle}
        toggleAll={toggleAll}
      />
    </>
  );
};
ProductVariantCreator.displayName = "ProductVariantCreator";
export default ProductVariantCreator;
