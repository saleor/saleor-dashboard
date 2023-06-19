import { useApolloClient } from "@apollo/client";
import {
  _GetAttributeChoicesDocument,
  _GetCategoriesChoicesDocument,
  _GetChannelOperandsDocument,
  _GetCollectionsChoicesDocument,
  _GetDynamicLeftOperandsDocument,
  _GetProductTypesChoicesDocument,
} from "@dashboard/graphql";
import { debounce } from "lodash";

import { ATTRIBUTE_INPUT_TYPE_CONDITIONS } from "../constants";
import { FilterElement } from "../FilterElement";

const getFilterElement = (
  value: Array<string | FilterElement>,
  index: number,
): FilterElement => {
  const possibleFilterElement = value[index];
  return typeof possibleFilterElement != "string"
    ? possibleFilterElement
    : null;
};

const isFilterElementAttribute = (FilterElement: FilterElement) => {
  const allowedInputTypes = Object.keys(ATTRIBUTE_INPUT_TYPE_CONDITIONS);

  return allowedInputTypes.includes(FilterElement.value.type);
};

export const useAPIOptions = (value: Array<string | FilterElement>) => {
  const client = useApolloClient();

  const getInitialRightOperatorOptions = async (position: string) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    if (isFilterElementAttribute(filterElement)) {
      const { data } = await client.query({
        query: _GetAttributeChoicesDocument,
        variables: {
          attributeId: filterElement.value.value,
          first: 5,
          query: "",
        },
      });
      return data.attribute.choices.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "collection") {
      const { data } = await client.query({
        query: _GetCollectionsChoicesDocument,
        variables: {
          first: 5,
          query: "",
        },
      });

      return data.collections.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "category") {
      const { data } = await client.query({
        query: _GetCategoriesChoicesDocument,
        variables: {
          first: 5,
          query: "",
        },
      });

      return data.categories.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "producttype") {
      const { data } = await client.query({
        query: _GetProductTypesChoicesDocument,
        variables: {
          first: 5,
          query: "",
        },
      });

      return data.productTypes.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "channel") {
      const { data } = await client.query({
        query: _GetChannelOperandsDocument,
      });

      return data.channels.map(({ id, name }: any) => ({
        label: name,
        value: id,
      }));
    }
  };

  const getRightOperatorOptionsByQuery = async (
    position: string,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    if (isFilterElementAttribute(filterElement)) {
      const { data } = await client.query({
        query: _GetAttributeChoicesDocument,
        variables: {
          attributeId: filterElement.value.value,
          first: 5,
          query: inputValue,
        },
      });
      return data.attribute.choices.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "collection") {
      const { data } = await client.query({
        query: _GetCollectionsChoicesDocument,
        variables: {
          first: 5,
          query: inputValue,
        },
      });

      return data.collections.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "category") {
      const { data } = await client.query({
        query: _GetCategoriesChoicesDocument,
        variables: {
          first: 5,
          query: inputValue,
        },
      });

      return data.categories.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }

    if (filterElement.value.value === "producttype") {
      const { data } = await client.query({
        query: _GetProductTypesChoicesDocument,
        variables: {
          first: 5,
          query: inputValue,
        },
      });

      return data.productTypes.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
    }
  };

  const getLeftOperatorOptionsByQuery = async (inputValue: string) => {
    const { data } = await client.query({
      query: _GetDynamicLeftOperandsDocument,
      variables: {
        first: 5,
        query: inputValue,
      },
    });
    const options = data.attributes.edges.map(({ node }: any) => ({
      label: node.name,
      value: node.id,
      type: node.inputType,
    }));

    return options;
  };

  return {
    getInitialRightOperatorOptions,
    getRightOperatorOptionsByQuery: debounce(
      getRightOperatorOptionsByQuery,
      500,
    ),
    getLeftOperatorOptionsByQuery: debounce(getLeftOperatorOptionsByQuery, 500),
  };
};
