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
import { FilterContainer } from "../useFilterContainer";

const getFilterElement = (value: any, index: number): FilterElement => {
  const possibleFilterElement = value[index];
  return typeof possibleFilterElement != "string"
    ? possibleFilterElement
    : null;
};

export const getInitialRightOperatorOptions = async (
  client: ApolloClient<any>,
  position: string,
  value: FilterContainer,
) => {
  const index = parseInt(position, 10);
  const filterElement = getFilterElement(value, index);

  if (filterElement.isAttribute()) {
    const { data } = await client.query({
      query: _GetAttributeChoicesDocument,
      variables: {
        slug: filterElement.value.value,
        first: 5,
        query: "",
      },
    });
    return data.attribute.choices.edges.map(({ node }) => ({
      label: node.name,
      value: node.id,
      slug: node.slug,
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
      slug: node.slug,
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
      slug: node.slug,
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
      slug: node.slug,
    }));
  }

  if (filterElement.isChannel()) {
    const { data } = await client.query({
      query: _GetChannelOperandsDocument,
    });

    return data.channels.map(({ id, name, slug }) => ({
      label: name,
      value: id,
      slug,
    }));
  }
};

export const getRightOperatorOptionsByQuery = async (
  client: ApolloClient<any>,
  position: string,
  value: FilterContainer,
  inputValue: string,
) => {
  const index = parseInt(position, 10);
  const filterElement = getFilterElement(value, index);

  if (filterElement.isAttribute()) {
    const { data } = await client.query({
      query: _GetAttributeChoicesDocument,
      variables: {
        slug: filterElement.value.value,
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
      slug: node.slug,
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
      slug: node.slug,
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
    const options = data.channels.map(({ id, name, slug }) => ({
      label: name,
      value: id,
      slug,
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
    slug: node.slug,
  }));
};
