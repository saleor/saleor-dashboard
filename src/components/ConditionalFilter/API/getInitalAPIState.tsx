import {
  use_GetChannelOperandsQuery,
  use_SearchAttributeOperandsQuery,
  use_SearchCategoriesOperandsQuery,
  use_SearchCollectionsOperandsQuery,
  use_SearchProductTypesOperandsQuery,
} from "@dashboard/graphql";

interface Props {
  category?: string[];
  collection?: string[];
  channel?: string[];
  producttype?: string[];
  attribute?: {
    [attribute: string]: string[];
  };
}

export const useInitialAPIState = ({
  category = [],
  collection = [],
  producttype = [],
  channel = [],
  attribute = {},
}: Props) => {
  const { data: channelsData } = use_GetChannelOperandsQuery({
    skip: channel.length === 0,
  });

  const { data: collectionsData } = use_SearchCollectionsOperandsQuery({
    variables: {
      collectionsSlugs: collection,
      first: collection.length,
    },
    skip: collection.length === 0,
  });

  const { data: categoriesData } = use_SearchCategoriesOperandsQuery({
    variables: {
      categoriesSlugs: category,
      first: category.length,
    },
    skip: category.length === 0,
  });

  const { data: productTypesData } = use_SearchProductTypesOperandsQuery({
    variables: {
      productTypesSlugs: producttype,
      first: producttype.length,
    },
    skip: producttype.length === 0,
  });

  const { data: attributesData } = use_SearchAttributeOperandsQuery({
    variables: {
      attributesSlugs: Object.keys(attribute),
      choicesIds: Object.values(attribute).flat(),
      first: Object.keys(attribute).length,
    },
    skip: Object.keys(attribute).length === 0,
  });

  const channelPicks =
    channelsData?.channels
      .filter(({ slug }) => channel.includes(slug))
      .map(({ id, name }) => ({ label: name, value: id })) ?? [];

  const collectionPicks =
    collectionsData?.search.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const categoryPicks =
    categoriesData?.search.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const productTypePicks =
    productTypesData?.search.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const attributePicks = attributesData?.search.edges.reduce(
    (acc, { node }) => ({
      ...acc,
      [node?.slug]: {
        choices: node?.choices.edges.map(({ node }) => ({
          label: node?.name,
          value: node?.id,
          inputType: node?.inputType,
          slug: node?.slug,
        })),
        slug: node?.slug,
        value: node?.id,
        label: node?.name,
      },
    }),
    {},
  );

  return {
    collection: collectionPicks,
    category: categoryPicks,
    producttype: productTypePicks,
    attribute: attributePicks,
    channel: channelPicks,
  };
};
