import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { stringify as stringifyQs } from "qs";
import React from "react";

import { PAGINATE_BY } from "../../config";
import { maybe } from "../../misc";
import TranslationsEntitiesList from "../components/TranslationsEntitiesList";
import TranslationsEntitiesListPage from "../components/TranslationsEntitiesListPage";
import {
  TypedAttributeTranslations,
  TypedCategoryTranslations,
  TypedCollectionTranslations,
  TypedPageTranslations,
  TypedProductTranslations,
  TypedSaleTranslations,
  TypedShippingMethodTranslations,
  TypedVoucherTranslations
} from "../queries";
import {
  LanguageEntitiesUrlQueryParams,
  languageEntityUrl,
  languageListUrl,
  TranslatableEntities
} from "../urls";

interface TranslationsEntitiesProps {
  language: string;
  params: LanguageEntitiesUrlQueryParams;
}

const sumCompleted = (list: any[]) =>
  list.reduce((acc, field) => acc + (field ? 1 : 0), 0);

const TranslationsEntities: React.FC<TranslationsEntitiesProps> = ({
  language,
  params
}) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const shop = useShop();

  if (Object.keys(TranslatableEntities).indexOf(params.tab) === -1) {
    navigate(
      "?" +
        stringifyQs({
          tab: TranslatableEntities.categories
        }),
      true
    );
  }

  const filterCallbacks = {
    onCategoriesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.categories
          })
      ),
    onCollectionsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.collections
          })
      ),
    onPagesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.pages
          })
      ),
    onAttributesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.attributes
          })
      ),
    onProductsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.products
          })
      ),
    onSalesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.sales
          })
      ),
    onShippingMethodsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.shippingMethods
          })
      ),
    onVouchersTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.vouchers
          })
      )
  };
  const lang = maybe(() =>
    shop.languages.find(languageFromList => languageFromList.code === language)
  );
  const paginationState = createPaginationState(PAGINATE_BY, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      language: language as any
    }),
    [params]
  );
  return (
    <TranslationsEntitiesListPage
      filters={{
        current: params.tab,
        ...filterCallbacks
      }}
      language={lang}
      onBack={() => navigate(languageListUrl)}
    >
      {params.tab === "categories" ? (
        <TypedCategoryTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );
            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "CategoryTranslatableContent" && {
                      completion: {
                        current: sumCompleted([
                          node.translation?.description,
                          node.translation?.name,
                          node.translation?.seoDescription,
                          node.translation?.seoTitle
                        ]),
                        max: 4
                      },
                      id: node?.category?.id,
                      name: node?.category?.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.categories,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedCategoryTranslations>
      ) : params.tab === "products" ? (
        <TypedProductTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );
            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "ProductTranslatableContent" && {
                      completion: {
                        current: sumCompleted([
                          node.translation?.description,
                          node.translation?.name,
                          node.translation?.seoDescription,
                          node.translation?.seoTitle
                        ]),
                        max: 4
                      },
                      id: node?.product?.id,
                      name: node?.product?.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.products,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedProductTranslations>
      ) : params.tab === "collections" ? (
        <TypedCollectionTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "CollectionTranslatableContent" && {
                      completion: {
                        current: sumCompleted([
                          node.translation?.description,
                          node.translation?.name,
                          node.translation?.seoDescription,
                          node.translation?.seoTitle
                        ]),
                        max: 4
                      },
                      id: node.collection.id,
                      name: node.collection.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.collections,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedCollectionTranslations>
      ) : params.tab === "sales" ? (
        <TypedSaleTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "SaleTranslatableContent" && {
                      completion: {
                        current: sumCompleted([node.translation?.name]),
                        max: 1
                      },
                      id: node.sale?.id,
                      name: node.sale?.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(language, TranslatableEntities.sales, id)
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedSaleTranslations>
      ) : params.tab === "vouchers" ? (
        <TypedVoucherTranslations
          variables={{
            ...paginationState,
            language: language as any
          }}
        >
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );
            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "VoucherTranslatableContent" && {
                      completion: {
                        current: sumCompleted([node.translation?.name]),
                        max: 1
                      },
                      id: node.voucher?.id,
                      name: node.voucher?.name || "-"
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.vouchers,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedVoucherTranslations>
      ) : params.tab === "pages" ? (
        <TypedPageTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "PageTranslatableContent" && {
                      completion: {
                        current: sumCompleted([
                          node.translation?.content,
                          node.translation?.seoDescription,
                          node.translation?.seoTitle,
                          node.translation?.title
                        ]),
                        max: 4
                      },
                      id: node?.page.id,
                      name: node?.page.title
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(language, TranslatableEntities.pages, id)
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedPageTranslations>
      ) : params.tab === "attributes" ? (
        <TypedAttributeTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );
            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "AttributeTranslatableContent" && {
                      completion: null,
                      id: node?.attribute.id,
                      name: node?.attribute.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.attributes,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedAttributeTranslations>
      ) : params.tab === "shippingMethods" ? (
        <TypedShippingMethodTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              data?.translations?.pageInfo,
              paginationState,
              params
            );
            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                  node =>
                    node.__typename === "ShippingMethodTranslatableContent" && {
                      completion: {
                        current: sumCompleted([
                          node.translation?.name,
                          node.translation?.description
                        ]),
                        max: 2
                      },
                      id: node?.shippingMethod.id,
                      name: node?.name
                    }
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.shippingMethods,
                      id
                    )
                  )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                pageInfo={pageInfo}
              />
            );
          }}
        </TypedShippingMethodTranslations>
      ) : null}
    </TranslationsEntitiesListPage>
  );
};
TranslationsEntities.displayName = "TranslationsEntities";
export default TranslationsEntities;
