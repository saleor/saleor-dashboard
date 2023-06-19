import { useApolloClient } from "@apollo/client";
import {
  _GetAttributeChoicesDocument,
  _GetCategoriesChoicesDocument,
  _GetChannelOperandsDocument,
  _GetCollectionsChoicesDocument,
  _GetProductTypesChoicesDocument,
} from "@dashboard/graphql";
import { debounce } from "lodash";

import { FilterElement } from "../FilterElement";
import { ATTRIBUTE_INPUT_TYPE_CONDITIONS } from "../staticConditions";

const isFilterElement = (value: any): value is FilterElement =>
  typeof value != "string";

export const getOptions = (edge: any[]) =>
  edge.map(({ node }: any) => ({
    label: node.name,
    value: node.id,
  }));

export const isFilterElementAttribute = (FilterElement: FilterElement) => {
  const allowedInputTypes = Object.keys(ATTRIBUTE_INPUT_TYPE_CONDITIONS);

  return allowedInputTypes.includes(FilterElement.value.type);
};

export const useAPIOptions = (value: Array<string | FilterElement>) => {
  const client = useApolloClient();

  const getInitialRightOperatorOptions = async (
    position: string,
    updater: any,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = value[index];

    if (isFilterElement(filterElement)) {
      if (isFilterElementAttribute(filterElement)) {
        const { data } = await client.query({
          query: _GetAttributeChoicesDocument,
          variables: {
            attributeId: filterElement.value.value,
            first: 5,
            query: "",
          },
        });

        const options = getOptions(data.attribute.choices.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "collection") {
        const { data } = await client.query({
          query: _GetCollectionsChoicesDocument,
          variables: {
            first: 5,
            query: "",
          },
        });

        const options = getOptions(data.collections.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "category") {
        const { data } = await client.query({
          query: _GetCategoriesChoicesDocument,
          variables: {
            first: 5,
            query: "",
          },
        });

        const options = getOptions(data.categories.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "producttype") {
        const { data } = await client.query({
          query: _GetProductTypesChoicesDocument,
          variables: {
            first: 5,
            query: "",
          },
        });

        const options = getOptions(data.productTypes.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "channel") {
        const { data } = await client.query({
          query: _GetChannelOperandsDocument,
        });

        const options = data.channels.map(({ id, name }: any) => ({
          label: name,
          value: id,
        }));
        updater(position, options);
      }
    }
  };

  const getRightOperatorOptionsByQuery = async (
    position: string,
    inputValue: string,
    updater: any,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = value[index];

    if (isFilterElement(filterElement)) {
      if (isFilterElementAttribute(filterElement)) {
        const { data } = await client.query({
          query: _GetAttributeChoicesDocument,
          variables: {
            attributeId: filterElement.value.value,
            first: 5,
            query: inputValue,
          },
        });

        const options = getOptions(data.attribute.choices.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "collection") {
        const { data } = await client.query({
          query: _GetCollectionsChoicesDocument,
          variables: {
            first: 5,
            query: inputValue,
          },
        });

        const options = getOptions(data.collections.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "category") {
        const { data } = await client.query({
          query: _GetCategoriesChoicesDocument,
          variables: {
            first: 5,
            query: inputValue,
          },
        });

        const options = getOptions(data.categories.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "producttype") {
        const { data } = await client.query({
          query: _GetProductTypesChoicesDocument,
          variables: {
            first: 5,
            query: inputValue,
          },
        });

        const options = getOptions(data.productTypes.edges);
        updater(position, options);
      }

      if (filterElement.value.value === "channel") {
        const { data } = await client.query({
          query: _GetChannelOperandsDocument,
        });

        const options = data.channels.map(({ id, name }: any) => ({
          label: name,
          value: id,
        }));
        const filteredOptions = options.filter(({ label }) =>
          label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        updater(position, filteredOptions);
      }
    }
  };

  return {
    getInitialRightOperatorOptions,
    getRightOperatorOptionsByQuery: debounce(
      getRightOperatorOptionsByQuery,
      500,
    ),
  };
};
