import { ApolloClient } from "@apollo/client";
import {
  _GetAttributeChoicesDocument,
  _GetAttributeChoicesQuery,
  _GetAttributeChoicesQueryVariables,
  _GetCategoriesChoicesDocument,
  _GetCategoriesChoicesQuery,
  _GetCategoriesChoicesQueryVariables,
  _GetChannelOperandsDocument,
  _GetChannelOperandsQuery,
  _GetChannelOperandsQueryVariables,
  _GetCollectionsChoicesDocument,
  _GetCollectionsChoicesQuery,
  _GetCollectionsChoicesQueryVariables,
  _GetDynamicLeftOperandsDocument,
  _GetDynamicLeftOperandsQuery,
  _GetDynamicLeftOperandsQueryVariables,
  _GetProductTypesChoicesDocument,
  _GetProductTypesChoicesQuery,
  _GetProductTypesChoicesQueryVariables,
} from "@dashboard/graphql";

interface OptionDTO {
  label: string;
  value: string;
  slug: string;
}

export interface Handler {
  client: ApolloClient<object>;
  query: string;
  fetch: () => Promise<OptionDTO[]>;
}

const createOptionsFromAPI = (
  // TODO: try to use type from graphql
  data: Array<{ node: { name: string; id: string; slug: string } }>,
): OptionDTO[] =>
  data.map(({ node }) => ({
    label: node.name,
    value: node.id,
    slug: node.slug,
  }));

export class AttributeChoicesHandler implements Handler {
  constructor(
    public client: ApolloClient<object>,
    public attributeSlug: string,
    public query: string,
  ) {}

  fetch = async () => {
    const { client, attributeSlug, query } = this;
    const { data } = await client.query<
      _GetAttributeChoicesQuery,
      _GetAttributeChoicesQueryVariables
    >({
      query: _GetAttributeChoicesDocument,
      variables: {
        slug: attributeSlug,
        first: 5,
        query,
      },
    });
    return createOptionsFromAPI(data.attribute.choices.edges);
  };
}

export class CollectionHandler implements Handler {
  constructor(public client: ApolloClient<object>, public query: string) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetCollectionsChoicesQuery,
      _GetCollectionsChoicesQueryVariables
    >({
      query: _GetCollectionsChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createOptionsFromAPI(data.collections.edges);
  };
}

export class CategoryHandler implements Handler {
  constructor(public client: ApolloClient<object>, public query: string) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetCategoriesChoicesQuery,
      _GetCategoriesChoicesQueryVariables
    >({
      query: _GetCategoriesChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createOptionsFromAPI(data.categories.edges);
  };
}

export class ProductTypeHandler implements Handler {
  constructor(public client: ApolloClient<object>, public query: string) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetProductTypesChoicesQuery,
      _GetProductTypesChoicesQueryVariables
    >({
      query: _GetProductTypesChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createOptionsFromAPI(data.productTypes.edges);
  };
}

export class ChannelHandler implements Handler {
  constructor(public client: ApolloClient<object>, public query: string) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetChannelOperandsQuery,
      _GetChannelOperandsQueryVariables
    >({
      query: _GetChannelOperandsDocument,
    });
    const options = data.channels.map(({ id, name, slug }) => ({
      label: name,
      value: id,
      slug,
    }));

    return options.filter(({ label }) =>
      label.toLowerCase().includes(this.query.toLowerCase()),
    );
  };
}

export class AttributesHandler implements Handler {
  constructor(public client: ApolloClient<object>, public query: string) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetDynamicLeftOperandsQuery,
      _GetDynamicLeftOperandsQueryVariables
    >({
      query: _GetDynamicLeftOperandsDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });
    return data.attributes.edges.map(({ node }) => ({
      label: node.name,
      value: node.id,
      type: node.inputType,
      slug: node.slug,
    }));
  };
}
