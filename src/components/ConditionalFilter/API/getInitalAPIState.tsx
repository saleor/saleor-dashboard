// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import {
  _GetChannelOperandsDocument,
  _SearchAttributeOperandsDocument,
  _SearchCategoriesOperandsDocument,
  _SearchCollectionsOperandsDocument,
  _SearchProductTypesOperandsDocument,
} from "@dashboard/graphql";
import { useEffect, useState } from "react";

import { InitialStateResponse } from "./InitialStateResponse";

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
  const client = useApolloClient();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queriesToRun = [];

    const fetchQueries = async () => {
      const data = await Promise.all(queriesToRun);
      setData(data);
      setLoading(false);
    };

    if (channel.length > 0) {
      queriesToRun.push(
        client.query({
          query: _GetChannelOperandsDocument,
        }),
      );
    } else {
      queriesToRun.push({});
    }

    if (collection.length > 0) {
      queriesToRun.push(
        client.query({
          query: _SearchCollectionsOperandsDocument,
          variables: {
            collectionsSlugs: collection,
            first: collection.length,
          },
        }),
      );
    } else {
      queriesToRun.push({});
    }

    if (category.length > 0) {
      queriesToRun.push(
        client.query({
          query: _SearchCategoriesOperandsDocument,
          variables: {
            categoriesSlugs: category,
            first: category.length,
          },
        }),
      );
    } else {
      queriesToRun.push({});
    }

    if (producttype.length > 0) {
      queriesToRun.push(
        client.query({
          query: _SearchProductTypesOperandsDocument,
          variables: {
            productTypesSlugs: producttype,
            first: producttype.length,
          },
        }),
      );
    } else {
      queriesToRun.push({});
    }

    if (Object.keys(attribute).length > 0) {
      queriesToRun.push(
        client.query({
          query: _SearchAttributeOperandsDocument,
          variables: {
            attributesSlugs: Object.keys(attribute),
            choicesIds: Object.values(attribute).flat(),
            first: Object.keys(attribute).length,
          },
        }),
      );
    } else {
      queriesToRun.push({});
    }

    fetchQueries();
  }, []);

  const [
    channelData,
    collectionData,
    categoryData,
    productTypesData,
    attributesData,
  ] = data;

  const channelPicks =
    channelData?.data?.channels
      ?.filter(({ slug }) => channel.includes(slug))
      .map(({ id, name }) => ({ label: name, value: id })) ?? [];

  const collectionPicks =
    collectionData?.data?.search?.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const categoryPicks =
    categoryData?.data?.search?.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const productTypePicks =
    productTypesData?.data?.search?.edges.map(({ node }) => ({
      label: node?.name,
      value: node?.id,
      slug: node?.slug,
    })) ?? [];

  const attributePicks =
    attributesData?.data?.search?.edges.reduce(
      (acc, { node }) => ({
        ...acc,
        [node?.slug]: {
          choices: node?.choices.edges.map(({ node }) => ({
            label: node?.name,
            value: node?.id,
            slug: node?.slug,
          })),
          slug: node?.slug,
          value: node?.id,
          label: node?.name,
          inputType: node?.inputType,
        },
      }),
      {},
    ) ?? {};

  return {
    data: new InitialStateResponse(
      categoryPicks,
      attributePicks,
      channelPicks,
      collectionPicks,
      productTypePicks,
    ),
    loading,
  };
};
