import { AttributeTranslationFragment } from "@saleor/fragments/types/AttributeTranslationFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { stringify as stringifyQs } from "qs";
import React from "react";

import { PAGINATE_BY } from "../../config";
import { maybe } from "../../misc";
import TranslationsEntitiesList from "../components/TranslationsEntitiesList";
import TranslationsEntitiesListPage from "../components/TranslationsEntitiesListPage";
import {
  TypedCategoryTranslations,
  TypedCollectionTranslations,
  TypedPageTranslations,
  TypedProductTranslations,
  TypedProductTypeTranslations,
  TypedSaleTranslations,
  TypedVoucherTranslations
} from "../queries";
import {
  languageEntitiesUrl,
  LanguageEntitiesUrlQueryParams,
  languageEntityUrl,
  languageListUrl,
  TranslatableEntities
} from "../urls";

interface TranslationsEntitiesProps {
  language: string;
  params: LanguageEntitiesUrlQueryParams;
}

function sumTranslations(
  acc: number,
  attr: AttributeTranslationFragment
): number {
  const accAfterNameTranslation =
    acc + (attr.translation && attr.translation.name !== null ? 1 : 0);
  const count =
    accAfterNameTranslation +
    attr.values.reduce(
      (acc2, attrValue) =>
        acc2 +
        (attrValue.translation && attrValue.translation.name !== null ? 1 : 0),
      0
    );
  return count;
}

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
    onProductTypesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.productTypes
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
      filter: {
        search: params.query
      },
      language: language as any
    }),
    [params]
  );

  return (
    <TranslationsEntitiesListPage
      initialSearch={params.query || ""}
      onSearchChange={query =>
        navigate(
          languageEntitiesUrl(language, {
            ...params,
            query
          }),
          true
        )
      }
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
              maybe(() => data.categories.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.categories.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? [
                              node.translation.descriptionJson,
                              node.translation.name,
                              node.translation.seoDescription,
                              node.translation.seoTitle
                            ].reduce(
                              (acc, field) => acc + (field !== null ? 1 : 0),
                              0
                            )
                          : 0,
                        max: 4
                      },
                      id: node.id,
                      name: node.name
                    }))
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
              maybe(() => data.products.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.products.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? [
                              node.translation.descriptionJson,
                              node.translation.name,
                              node.translation.seoDescription,
                              node.translation.seoTitle
                            ].reduce(
                              (acc, field) => acc + (field !== null ? 1 : 0),
                              0
                            )
                          : 0,
                        max: 4
                      },
                      id: node.id,
                      name: node.name
                    }))
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
              maybe(() => data.collections.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.collections.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? [
                              node.translation.descriptionJson,
                              node.translation.name,
                              node.translation.seoDescription,
                              node.translation.seoTitle
                            ].reduce(
                              (acc, field) => acc + (field !== null ? 1 : 0),
                              0
                            )
                          : 0,
                        max: 4
                      },
                      id: node.id,
                      name: node.name
                    }))
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
              maybe(() => data.sales.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.sales.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? +!!node.translation.name
                          : 0,
                        max: 1
                      },
                      id: node.id,
                      name: node.name
                    }))
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
        <TypedVoucherTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              maybe(() => data.vouchers.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.vouchers.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? +!!node.translation.name
                          : 0,
                        max: 1
                      },
                      id: node.id,
                      name: node.name
                    }))
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
              maybe(() => data.pages.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.pages.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current: node.translation
                          ? [
                              node.translation.contentJson,
                              node.translation.seoDescription,
                              node.translation.seoTitle,
                              node.translation.title
                            ].reduce(
                              (acc, field) => acc + (field !== null ? 1 : 0),
                              0
                            )
                          : 0,
                        max: 4
                      },
                      id: node.id,
                      name: node.title
                    }))
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
      ) : params.tab === "productTypes" ? (
        <TypedProductTypeTranslations variables={queryVariables}>
          {({ data, loading }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              maybe(() => data.productTypes.pageInfo),
              paginationState,
              params
            );

            return (
              <TranslationsEntitiesList
                disabled={loading}
                entities={maybe(() =>
                  data.productTypes.edges
                    .map(edge => edge.node)
                    .map(node => ({
                      completion: {
                        current:
                          node.productAttributes && node.variantAttributes
                            ? maybe(() => node.productAttributes, []).reduce(
                                sumTranslations,
                                0
                              ) +
                              maybe(() => node.variantAttributes, []).reduce(
                                sumTranslations,
                                0
                              )
                            : 0,
                        max:
                          node.productAttributes && node.variantAttributes
                            ? node.productAttributes.reduce(
                                (acc, attr) => acc + attr.values.length,
                                node.productAttributes.length
                              ) +
                              node.variantAttributes.reduce(
                                (acc, attr) => acc + attr.values.length,
                                node.variantAttributes.length
                              )
                            : 0
                      },
                      id: node.id,
                      name: node.name
                    }))
                )}
                onRowClick={id =>
                  navigate(
                    languageEntityUrl(
                      language,
                      TranslatableEntities.productTypes,
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
        </TypedProductTypeTranslations>
      ) : null}
    </TranslationsEntitiesListPage>
  );
};
TranslationsEntities.displayName = "TranslationsEntities";
export default TranslationsEntities;
