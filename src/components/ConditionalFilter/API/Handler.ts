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
import { IntlShape } from "react-intl";

import { RowType } from "../constants";
import { ItemOption } from "../FilterElement/ConditionValue";
import { LeftOperand } from "../LeftOperandsProvider";
import { getLocalizedLabel } from "./initialState/orders/intl";

export interface Handler {
  fetch: () => Promise<ItemOption[]>;
}

export const createOptionsFromAPI = (
  data: Array<{
    node: {
      name: string | null;
      id: string;
      slug: string;
      originalSlug?: string | null;
    };
  }>,
): ItemOption[] =>
  data.map(({ node }) => ({
    label: node.name ?? "",
    value: node.id,
    slug: node.slug,
    originalSlug: node.originalSlug,
  }));

export class AttributeChoicesHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
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

    return createOptionsFromAPI(data.attribute?.choices?.edges ?? []);
  };
}

export class CollectionHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

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

    return createOptionsFromAPI(data.collections?.edges ?? []);
  };
}

export class CategoryHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

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

    return createOptionsFromAPI(data.categories?.edges ?? []);
  };
}

export class ProductTypeHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

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

    return createOptionsFromAPI(data.productTypes?.edges ?? []);
  };
}

export class ChannelHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetChannelOperandsQuery,
      _GetChannelOperandsQueryVariables
    >({
      query: _GetChannelOperandsDocument,
    });
    const options =
      data.channels?.map(({ id, name, slug }) => ({
        label: name,
        value: id,
        slug,
      })) ?? [];

    return options.filter(({ label }) => label.toLowerCase().includes(this.query.toLowerCase()));
  };
}

export class AttributesHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (): Promise<LeftOperand[]> => {
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

    return (
      data.attributes?.edges.map(({ node }) => ({
        label: node.name ?? "",
        value: node.id,
        type: node.inputType ?? ("" as LeftOperand["type"]),
        slug: node.slug ?? "",
      })) ?? []
    );
  };
}

export class BooleanValuesHandler implements Handler {
  constructor(public options: LeftOperand[]) {}

  fetch = async (): Promise<LeftOperand[]> => {
    return this.options;
  };
}

export class EnumValuesHandler implements Handler {
  private options: LeftOperand[];

  constructor(enumObject: Record<string, string>, type: RowType, intl: IntlShape) {
    this.options = Object.values(enumObject).map(value => ({
      value,
      slug: value,
      type: type as LeftOperand["type"], // TODO
      label: getLocalizedLabel(type as LeftOperand["type"], value, intl), // TODO: get label from enum, translation
    }));
  }

  fetch = async (): Promise<LeftOperand[]> => {
    return this.options;
  };
}
