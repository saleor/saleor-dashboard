// @ts-strict-ignore
import { ApolloClient } from "@apollo/client";
import {
  _GetAttributeChoicesDocument,
  _GetCategoriesChoicesDocument,
  _GetChannelOperandsDocument,
  _GetCollectionsChoicesDocument,
  _GetDynamicLeftOperandsDocument,
  _GetProductTypesChoicesDocument,
} from "@dashboard/graphql";

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

export const getInitialRightOperatorOptions = async (
  client: ApolloClient<any>,
  position: string,
  value: Array<string | FilterElement>,
) => {
  const index = parseInt(position, 10);
  const filterElement = getFilterElement(value, index);

  if (filterElement.isAttribute()) {
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

  if (filterElement.isCollection()) {
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

  if (filterElement.isCategory()) {
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

  if (filterElement.isProductType()) {
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

  if (filterElement.isChannel()) {
    const { data } = await client.query({
      query: _GetChannelOperandsDocument,
    });

    return data.channels.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  }
};

export const getRightOperatorOptionsByQuery = async (
  client: ApolloClient<any>,
  position: string,
  value: Array<string | FilterElement>,
  inputValue: string,
) => {
  const index = parseInt(position, 10);
  const filterElement = getFilterElement(value, index);

  if (filterElement.isAttribute()) {
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

  if (filterElement.isCollection()) {
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

  if (filterElement.isCategory()) {
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

  if (filterElement.isProductType()) {
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

  if (filterElement.isChannel()) {
    const { data } = await client.query({
      query: _GetChannelOperandsDocument,
    });
    const options = data.channels.map(({ id, name }) => ({
      label: name,
      value: id,
    }));

    return options.filter(({ label }) =>
      label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }
};

export const getLeftOperatorOptions = async (
  client: any,
  inputValue: string,
) => {
  const { data } = await client.query({
    query: _GetDynamicLeftOperandsDocument,
    variables: {
      first: 5,
      query: inputValue,
    },
  });
  return data.attributes.edges.map(({ node }) => ({
    label: node.name,
    value: node.id,
    type: node.inputType,
  }));
};
