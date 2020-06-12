import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

import { decimal, maybe } from "../../misc";
import ProductCreatePage, {
  ProductCreatePageSubmitData
} from "../components/ProductCreatePage";
import { TypedProductCreateMutation } from "../mutations";
import { ProductCreate } from "../types/ProductCreate";
import { productListUrl, productUrl } from "../urls";

export const ProductCreateView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const {
    loadMore: loadMoreCategories,
    search: searchCategory,
    result: searchCategoryOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollection,
    result: searchCollectionOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreProductTypes,
    search: searchProductTypes,
    result: searchProductTypesOpts
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });

  const handleBack = () => navigate(productListUrl());

  const handleSuccess = (data: ProductCreate) => {
    if (data.productCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Product created"
        })
      });
      navigate(productUrl(data.productCreate.product.id));
    }
  };

  return (
    <TypedProductCreateMutation onCompleted={handleSuccess}>
      {(productCreate, productCreateOpts) => {
        const handleSubmit = (formData: ProductCreatePageSubmitData) => {
          productCreate({
            variables: {
              attributes: formData.attributes.map(attribute => ({
                id: attribute.id,
                values: attribute.value
              })),
              basePrice: decimal(formData.basePrice),
              category: formData.category,
              chargeTaxes: formData.chargeTaxes,
              collections: formData.collections,
              descriptionJson: JSON.stringify(formData.description),
              isPublished: formData.isPublished,
              name: formData.name,
              productType: formData.productType,
              publicationDate:
                formData.publicationDate !== ""
                  ? formData.publicationDate
                  : null,
              seo: {
                description: formData.seoDescription,
                title: formData.seoTitle
              },
              sku: formData.sku,
              stocks: formData.stocks.map(stock => ({
                quantity: parseInt(stock.value, 0),
                warehouse: stock.id
              })),
              trackInventory: formData.trackInventory
            }
          });
        };

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create Product",
                description: "window title"
              })}
            />
            <ProductCreatePage
              currency={maybe(() => shop.defaultCurrency)}
              categories={maybe(
                () => searchCategoryOpts.data.search.edges,
                []
              ).map(edge => edge.node)}
              collections={maybe(
                () => searchCollectionOpts.data.search.edges,
                []
              ).map(edge => edge.node)}
              disabled={productCreateOpts.loading}
              errors={productCreateOpts.data?.productCreate.errors || []}
              fetchCategories={searchCategory}
              fetchCollections={searchCollection}
              fetchProductTypes={searchProductTypes}
              header={intl.formatMessage({
                defaultMessage: "New Product",
                description: "page header"
              })}
              productTypes={maybe(() =>
                searchProductTypesOpts.data.search.edges.map(edge => edge.node)
              )}
              onBack={handleBack}
              onSubmit={handleSubmit}
              saveButtonBarState={productCreateOpts.status}
              fetchMoreCategories={{
                hasMore: maybe(
                  () => searchCategoryOpts.data.search.pageInfo.hasNextPage
                ),
                loading: searchCategoryOpts.loading,
                onFetchMore: loadMoreCategories
              }}
              fetchMoreCollections={{
                hasMore: maybe(
                  () => searchCollectionOpts.data.search.pageInfo.hasNextPage
                ),
                loading: searchCollectionOpts.loading,
                onFetchMore: loadMoreCollections
              }}
              fetchMoreProductTypes={{
                hasMore: maybe(
                  () => searchProductTypesOpts.data.search.pageInfo.hasNextPage
                ),
                loading: searchProductTypesOpts.loading,
                onFetchMore: loadMoreProductTypes
              }}
              warehouses={
                warehouses.data?.warehouses.edges.map(edge => edge.node) || []
              }
            />
          </>
        );
      }}
    </TypedProductCreateMutation>
  );
};
export default ProductCreateView;
