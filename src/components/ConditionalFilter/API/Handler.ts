import { type ApolloClient } from "@apollo/client";
import { createBooleanOptions } from "@dashboard/components/ConditionalFilter/constants";
import {
  _GetAttributeChoicesDocument,
  type _GetAttributeChoicesQuery,
  type _GetAttributeChoicesQueryVariables,
  _GetCategoriesChoicesDocument,
  type _GetCategoriesChoicesQuery,
  type _GetCategoriesChoicesQueryVariables,
  _GetChannelOperandsDocument,
  type _GetChannelOperandsQuery,
  type _GetChannelOperandsQueryVariables,
  _GetCollectionsChoicesDocument,
  type _GetCollectionsChoicesQuery,
  type _GetCollectionsChoicesQueryVariables,
  _GetCustomersChoicesDocument,
  type _GetCustomersChoicesQuery,
  type _GetCustomersChoicesQueryVariables,
  _GetCustomerTypesChoicesDocument,
  type _GetCustomerTypesChoicesQuery,
  type _GetCustomerTypesChoicesQueryVariables,
  _GetDynamicLeftOperandsDocument,
  type _GetDynamicLeftOperandsQuery,
  type _GetDynamicLeftOperandsQueryVariables,
  _GetGiftCardTagsChoicesDocument,
  type _GetGiftCardTagsChoicesQuery,
  type _GetGiftCardTagsChoicesQueryVariables,
  _GetLegacyChannelOperandsDocument,
  _GetPagesChoicesDocument,
  type _GetPagesChoicesQuery,
  type _GetPagesChoicesQueryVariables,
  _GetPageTypesChoicesDocument,
  type _GetPageTypesChoicesQuery,
  type _GetPageTypesChoicesQueryVariables,
  _GetProductChoicesDocument,
  type _GetProductChoicesQuery,
  type _GetProductChoicesQueryVariables,
  _GetProductTypesChoicesDocument,
  type _GetProductTypesChoicesQuery,
  type _GetProductTypesChoicesQueryVariables,
  _GetProductVariantChoicesDocument,
  type _GetProductVariantChoicesQuery,
  type _GetProductVariantChoicesQueryVariables,
  _GetWarehouseChoicesDocument,
  type _GetWarehouseChoicesQuery,
  type _GetWarehouseChoicesQueryVariables,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  ChannelCurrenciesDocument,
  type ChannelCurrenciesQuery,
  type ChannelCurrenciesQueryVariables,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { type ItemOption } from "../FilterElement/ConditionValue";
import { type LeftOperand } from "../LeftOperandsProvider";
import {
  FILTER_CHOICES_PAGE_SIZE,
  type FilterChoicesPageInfo,
  NO_MORE_CHOICES,
  pageInfoFromConnection,
} from "./filterChoicesPage";
import { getLocalizedLabel } from "./intl";

export interface Handler {
  fetch: (after?: string | null) => Promise<ItemOption[]>;
  pageInfo?: FilterChoicesPageInfo;
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

export const createAttributeProductVariantOptionsFromAPI = (
  data: Array<{
    node: {
      name: string | null;
      id: string;
      slug?: string;
      originalSlug?: string | null;
      product?: {
        name: string;
      };
    };
  }>,
): ItemOption[] =>
  data.map(
    ({ node }) =>
      ({
        // This label matches value from AttributeValue.name for product variant reference attributes
        // It's used by Saleor for searching ProductVariants
        label: node.product ? `${node.product.name}: ${node.name}` : (node.name ?? ""),
        value: node.id,
        slug: node.slug,
        originalSlug: node.originalSlug,
      }) as ItemOption,
  );

export class AttributeChoicesHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public attributeSlug: string,
    public query: string,
    public type: string,
  ) {}

  fetch = async (after?: string | null) => {
    /**
     * Boolean attributes don't expose `choices` to fetch.
     * Use static true/false options instead.
     */
    if (this.type === AttributeInputTypeEnum.BOOLEAN) {
      this.pageInfo = NO_MORE_CHOICES;

      return createBooleanOptions();
    }

    const { client, attributeSlug, query } = this;
    const { data } = await client.query<
      _GetAttributeChoicesQuery,
      _GetAttributeChoicesQueryVariables
    >({
      query: _GetAttributeChoicesDocument,
      variables: {
        slug: attributeSlug,
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.attribute?.choices);

    return createOptionsFromAPI(data.attribute?.choices?.edges ?? []);
  };
}

export class CollectionHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetCollectionsChoicesQuery,
      _GetCollectionsChoicesQueryVariables
    >({
      query: _GetCollectionsChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.collections);

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
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetCategoriesChoicesQuery,
      _GetCategoriesChoicesQueryVariables
    >({
      query: _GetCategoriesChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.categories);

    return createOptionsFromAPI(data.categories?.edges ?? []);
  };
}

export class ProductTypeHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetProductTypesChoicesQuery,
      _GetProductTypesChoicesQueryVariables
    >({
      query: _GetProductTypesChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.productTypes);

    return createOptionsFromAPI(data.productTypes?.edges ?? []);
  };
}

export class ProductsHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetProductChoicesQuery,
      _GetProductChoicesQueryVariables
    >({
      query: _GetProductChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.products);

    return createOptionsFromAPI(data.products?.edges ?? []);
  };
}

export class ProductVariantHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetProductVariantChoicesQuery,
      _GetProductVariantChoicesQueryVariables
    >({
      query: _GetProductVariantChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.productVariants);

    return createAttributeProductVariantOptionsFromAPI(data.productVariants?.edges ?? []);
  };
}

export class PageHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<_GetPagesChoicesQuery, _GetPagesChoicesQueryVariables>(
      {
        query: _GetPagesChoicesDocument,
        variables: {
          first: FILTER_CHOICES_PAGE_SIZE,
          after,
          query: this.query,
        },
      },
    );

    this.pageInfo = pageInfoFromConnection(data.pages);

    return createOptionsFromAPI(data.pages?.edges ?? []);
  };
}

export class GiftCardTagsHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetGiftCardTagsChoicesQuery,
      _GetGiftCardTagsChoicesQueryVariables
    >({
      query: _GetGiftCardTagsChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.giftCardTags);

    return (
      data?.giftCardTags?.edges.map(({ node }) => ({
        label: node.name,
        value: node.name,
        slug: node.name,
      })) ?? []
    );
  };
}

export class WarehouseHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetWarehouseChoicesQuery,
      _GetWarehouseChoicesQueryVariables
    >({
      query: _GetWarehouseChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.warehouses);

    return createOptionsFromAPI(data.warehouses?.edges ?? []);
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
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetCustomersChoicesQuery,
      _GetCustomersChoicesQueryVariables
    >({
      query: _GetCustomersChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.customers);

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
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
    public type: AttributeTypeEnum = AttributeTypeEnum.PRODUCT_TYPE,
  ) {}

  fetch = async (after?: string | null): Promise<LeftOperand[]> => {
    const { data } = await this.client.query<
      _GetDynamicLeftOperandsQuery,
      _GetDynamicLeftOperandsQueryVariables
    >({
      query: _GetDynamicLeftOperandsDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
        type: this.type,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.attributes);

    return (data.attributes?.edges.map(({ node }) => ({
      label: node.name ?? "",
      value: node.id,
      type: node.inputType ?? ("" as LeftOperand["type"]),
      slug: node.slug ?? "",
      entityType: node.entityType,
    })) ?? []) as LeftOperand[];
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
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetPageTypesChoicesQuery,
      _GetPageTypesChoicesQueryVariables
    >({
      query: _GetPageTypesChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.pageTypes);

    return createOptionsFromAPI(data.pageTypes?.edges ?? []);
  };
}

export class CustomerTypeHandler implements Handler {
  public pageInfo: FilterChoicesPageInfo = NO_MORE_CHOICES;

  constructor(
    public client: ApolloClient<unknown>,
    public query: string,
  ) {}

  fetch = async (after?: string | null) => {
    const { data } = await this.client.query<
      _GetCustomerTypesChoicesQuery,
      _GetCustomerTypesChoicesQueryVariables
    >({
      query: _GetCustomerTypesChoicesDocument,
      variables: {
        first: FILTER_CHOICES_PAGE_SIZE,
        after,
        query: this.query,
      },
    });

    this.pageInfo = pageInfoFromConnection(data.customerTypes);

    return createOptionsFromAPI(data.customerTypes?.edges ?? []);
  };
}

export const NoopValuesHandler = TextInputValuesHandler;
