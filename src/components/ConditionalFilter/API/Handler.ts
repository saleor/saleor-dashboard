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
  _GetCustomersChoicesDocument,
  _GetCustomersChoicesQuery,
  _GetCustomersChoicesQueryVariables,
  _GetDynamicLeftOperandsDocument,
  _GetDynamicLeftOperandsQuery,
  _GetDynamicLeftOperandsQueryVariables,
  _GetGiftCardTagsChoicesDocument,
  _GetGiftCardTagsChoicesQuery,
  _GetGiftCardTagsChoicesQueryVariables,
  _GetLegacyChannelOperandsDocument,
  _GetPageTypesChoicesDocument,
  _GetPageTypesChoicesQuery,
  _GetPageTypesChoicesQueryVariables,
  _GetProductChoicesDocument,
  _GetProductChoicesQuery,
  _GetProductChoicesQueryVariables,
  _GetProductTypesChoicesDocument,
  _GetProductTypesChoicesQuery,
  _GetProductTypesChoicesQueryVariables,
  ChannelCurrenciesDocument,
  ChannelCurrenciesQuery,
  ChannelCurrenciesQueryVariables,
} from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { ItemOption } from "../FilterElement/ConditionValue";
import { LeftOperand } from "../LeftOperandsProvider";
import { getLocalizedLabel } from "./intl";

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

export const createCustomerOptionsFromAPI = (
  data: Array<{
    node: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }>,
) => {
  return (
    data.map(({ node }) => ({
      label: node?.firstName && node?.lastName ? `${node.firstName} ${node.lastName}` : node.email,
      value: node.id,
      slug: node.id,
    })) ?? []
  );
};

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

export class CurrencyHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      ChannelCurrenciesQuery,
      ChannelCurrenciesQueryVariables
    >({
      query: ChannelCurrenciesDocument,
      variables: {},
    });

    return data.shop.channelCurrencies
      .map(currency => ({
        label: currency,
        value: currency,
        slug: currency,
      }))
      .filter(({ label }) => {
        return label.toLowerCase().includes(this.query.toLowerCase());
      });
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

export class ProductsHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetProductChoicesQuery,
      _GetProductChoicesQueryVariables
    >({
      query: _GetProductChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createOptionsFromAPI(data.products?.edges ?? []);
  };
}

export class GiftCardTagsHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetGiftCardTagsChoicesQuery,
      _GetGiftCardTagsChoicesQueryVariables
    >({
      query: _GetGiftCardTagsChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return (
      data?.giftCardTags?.edges.map(({ node }) => ({
        label: node.name,
        value: node.name,
        slug: node.name,
      })) ?? []
    );
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

export class CustomerHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetCustomersChoicesQuery,
      _GetCustomersChoicesQueryVariables
    >({
      query: _GetCustomersChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createCustomerOptionsFromAPI(data.customers?.edges ?? []);
  };
}

// 'Orders' filter required channel ID, not slug
export class LegacyChannelHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetChannelOperandsQuery,
      _GetChannelOperandsQueryVariables
    >({
      query: _GetLegacyChannelOperandsDocument,
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

  public query?: string[];

  constructor(
    enumObject: Record<string, string>,
    type: LeftOperand["type"],
    intl: IntlShape,
    query?: string[],
  ) {
    this.options = Object.values(enumObject).map(value => ({
      value,
      slug: value,
      type,
      label: getLocalizedLabel(type, value, intl),
    }));
    this.query = query;
  }

  fetch = async (): Promise<LeftOperand[]> => {
    if (this.query) {
      return this.options.filter(el => {
        if (this.query) {
          return this.query.includes(el.value);
        }

        return false;
      });
    }

    return this.options;
  };
}

export class TextInputValuesHandler implements Handler {
  constructor(public options: LeftOperand[]) {}

  fetch = async (): Promise<LeftOperand[]> => {
    return this.options;
  };
}

export class PageTypesHandler implements Handler {
  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async () => {
    const { data } = await this.client.query<
      _GetPageTypesChoicesQuery,
      _GetPageTypesChoicesQueryVariables
    >({
      query: _GetPageTypesChoicesDocument,
      variables: {
        first: 5,
        query: this.query,
      },
    });

    return createOptionsFromAPI(data.pageTypes?.edges ?? []);
  };
}

export const NoopValuesHandler = TextInputValuesHandler;
