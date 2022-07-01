import { useShopLimitsQuery } from "@saleor/components/Shop/queries";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  useCreateMultipleVariantsDataQuery,
  useProductVariantBulkCreateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { productUrl } from "@saleor/products/urls";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import ProductVariantCreatorPage from "../../components/ProductVariantCreatorPage";

interface ProductVariantCreatorProps {
  id: string;
}

const ProductVariantCreator: React.FC<ProductVariantCreatorProps> = ({
  id,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { data } = useCreateMultipleVariantsDataQuery({
    displayLoader: true,
    variables: {
      id,
      firstValues: 10,
    },
  });
  const [
    bulkProductVariantCreate,
    bulkProductVariantCreateOpts,
  ] = useProductVariantBulkCreateMutation({
    onCompleted: data => {
      if (data.productVariantBulkCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "oChkS4",
            defaultMessage: "Successfully created variants",
            description: "success message",
          }),
        });
        navigate(productUrl(id));
      }
    },
  });
  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true,
    },
  });

  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    reset: searchAttributeReset,
    result: searchAttributeValuesOpts,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "z+wMgQ",
          defaultMessage: "Create Variants",
          description: "window title",
        })}
      />
      <ProductVariantCreatorPage
        errors={
          bulkProductVariantCreateOpts.data?.productVariantBulkCreate.errors ||
          []
        }
        channelListings={data?.product?.channelListings?.map(listing => ({
          currency: listing.channel.currencyCode,
          id: listing.channel.id,
          name: listing.channel.name,
          price: "",
        }))}
        attributes={data?.product?.productType?.variantAttributes || []}
        attributeValues={attributeValues}
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        limits={limitOpts.data?.shop?.limits}
        onSubmit={inputs =>
          bulkProductVariantCreate({
            variables: { id, inputs },
          })
        }
        onAttributeSelectBlur={searchAttributeReset}
        warehouses={mapEdgesToItems(data?.warehouses) || []}
      />
    </>
  );
};
ProductVariantCreator.displayName = "ProductVariantCreator";
export default ProductVariantCreator;
