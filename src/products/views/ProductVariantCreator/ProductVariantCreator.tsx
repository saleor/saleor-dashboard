import { WindowTitle } from "@saleor/components/WindowTitle";
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
    variables: { channel: "default-channel", id }
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
        defaultPrice={data?.product?.channelListing[0]?.discountedPrice.amount.toString()}
        errors={
          bulkProductVariantCreateOpts.data?.productVariantBulkCreate.errors ||
          []
        }
        channels={data?.product?.channelListing?.map(listing => ({
          currency: listing.discountedPrice.currency,
          id: listing.channel.id,
          name: listing.channel.name,
          price: listing.discountedPrice.amount
        }))}
        attributes={data?.product?.productType?.variantAttributes || []}
        currencySymbol={shop?.defaultCurrency}
        onSubmit={inputs =>
          bulkProductVariantCreate({
            variables: { id, inputs }
          })
        }
        warehouses={data?.warehouses.edges.map(edge => edge.node) || []}
      />
    </>
  );
};
ProductVariantCreator.displayName = "ProductVariantCreator";
export default ProductVariantCreator;
