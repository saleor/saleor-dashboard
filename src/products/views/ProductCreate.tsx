import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import SearchProductTypes from "@saleor/containers/SearchProductTypes";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { DEFAULT_INITIAL_SEARCH_DATA } from "../../config";
import SearchCategories from "../../containers/SearchCategories";
import SearchCollections from "../../containers/SearchCollections";
import { decimal, getMutationState, maybe } from "../../misc";
import ProductCreatePage, {
  ProductCreatePageSubmitData
} from "../components/ProductCreatePage";
import { TypedProductCreateMutation } from "../mutations";
import { ProductCreate } from "../types/ProductCreate";
import { productListUrl, productUrl } from "../urls";

interface ProductUpdateProps {
  id: string;
}

export const ProductUpdate: React.StatelessComponent<
  ProductUpdateProps
> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const handleBack = () => navigate(productListUrl());

  return (
    <SearchCategories variables={DEFAULT_INITIAL_SEARCH_DATA}>
      {({
        loadMore: loadMoreCategories,
        search: searchCategory,
        result: searchCategoryOpts
      }) => (
        <SearchCollections variables={DEFAULT_INITIAL_SEARCH_DATA}>
          {({
            loadMore: loadMoreCollections,
            search: searchCollection,
            result: searchCollectionOpts
          }) => (
            <SearchProductTypes variables={DEFAULT_INITIAL_SEARCH_DATA}>
              {({
                loadMore: loadMoreProductTypes,
                search: searchProductTypes,
                result: searchProductTypesOpts
              }) => {
                const handleSuccess = (data: ProductCreate) => {
                  if (data.productCreate.errors.length === 0) {
                    notify({
                      text: intl.formatMessage({
                        defaultMessage: "Product created"
                      })
                    });
                    navigate(productUrl(data.productCreate.product.id));
                  } else {
                    const attributeError = data.productCreate.errors.find(
                      err => err.field === "attributes"
                    );
                    if (!!attributeError) {
                      notify({ text: attributeError.message });
                    }
                  }
                };

                return (
                  <TypedProductCreateMutation onCompleted={handleSuccess}>
                    {(
                      productCreate,
                      {
                        called: productCreateCalled,
                        data: productCreateData,
                        loading: productCreateDataLoading
                      }
                    ) => {
                      const handleSubmit = (
                        formData: ProductCreatePageSubmitData
                      ) => {
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
                            descriptionJson: JSON.stringify(
                              formData.description
                            ),
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
                            stockQuantity:
                              formData.stockQuantity !== null
                                ? formData.stockQuantity
                                : 0
                          }
                        });
                      };

                      const formTransitionState = getMutationState(
                        productCreateCalled,
                        productCreateDataLoading,
                        maybe(() => productCreateData.productCreate.errors)
                      );
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
                            disabled={productCreateDataLoading}
                            errors={maybe(
                              () => productCreateData.productCreate.errors,
                              []
                            )}
                            fetchCategories={searchCategory}
                            fetchCollections={searchCollection}
                            fetchProductTypes={searchProductTypes}
                            header={intl.formatMessage({
                              defaultMessage: "New Product",
                              description: "page header"
                            })}
                            productTypes={maybe(() =>
                              searchProductTypesOpts.data.search.edges.map(
                                edge => edge.node
                              )
                            )}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                            saveButtonBarState={formTransitionState}
                            fetchMoreCategories={{
                              hasMore: maybe(
                                () =>
                                  searchCategoryOpts.data.search.pageInfo
                                    .hasNextPage
                              ),
                              loading: searchCategoryOpts.loading,
                              onFetchMore: loadMoreCategories
                            }}
                            fetchMoreCollections={{
                              hasMore: maybe(
                                () =>
                                  searchCollectionOpts.data.search.pageInfo
                                    .hasNextPage
                              ),
                              loading: searchCollectionOpts.loading,
                              onFetchMore: loadMoreCollections
                            }}
                            fetchMoreProductTypes={{
                              hasMore: maybe(
                                () =>
                                  searchProductTypesOpts.data.search.pageInfo
                                    .hasNextPage
                              ),
                              loading: searchProductTypesOpts.loading,
                              onFetchMore: loadMoreProductTypes
                            }}
                          />
                        </>
                      );
                    }}
                  </TypedProductCreateMutation>
                );
              }}
            </SearchProductTypes>
          )}
        </SearchCollections>
      )}
    </SearchCategories>
  );
};
export default ProductUpdate;
