import { FilterElement, IFilter } from "@saleor/components/Filter";
import {
  GiftCardFilterInput,
  SearchCustomersQuery,
  SearchProductsQuery,
} from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getMinMaxQueryParam,
  getMultipleValueQueryParam,
  getSingleValueQueryParam,
} from "@saleor/utils/filters";
import {
  createAutocompleteField,
  createNumberField,
  createOptionsField,
} from "@saleor/utils/filters/fields";
import {
  mapNodeToChoice,
  mapPersonNodeToChoice,
  mapSingleValueNodeToChoice,
} from "@saleor/utils/maps";
import { defineMessages, IntlShape } from "react-intl";

import { GiftCardListUrlQueryParams } from "../types";
import {
  GiftCardListFilterKeys,
  GiftCardListFilterOpts,
  GiftCardListUrlFilters,
  GiftCardListUrlFiltersEnum,
  GiftCardStatusFilterEnum,
  SearchWithFetchMoreProps,
} from "./types";

export const GIFT_CARD_FILTERS_KEY = "giftCardFilters";

interface GiftCardFilterOptsProps {
  params: GiftCardListUrlFilters;
  currencies: string[];
  loadingCurrencies: boolean;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  productSearchProps: SearchWithFetchMoreProps;
  customers: RelayToFlat<SearchCustomersQuery["search"]>;
  customerSearchProps: SearchWithFetchMoreProps;
  tags: string[];
  tagSearchProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
  params,
  currencies,
  loadingCurrencies,
  products,
  productSearchProps,
  customers,
  customerSearchProps,
  tags,
  tagSearchProps,
}: GiftCardFilterOptsProps): GiftCardListFilterOpts => ({
  currency: {
    active: !!params?.currency,
    value: params?.currency,
    choices: mapSingleValueNodeToChoice(currencies),
    displayValues: mapSingleValueNodeToChoice(currencies),
    loading: loadingCurrencies,
  },
  product: {
    active: !!params?.product,
    value: params?.product,
    choices: mapNodeToChoice(products),
    displayValues: mapSingleValueNodeToChoice(products),
    initialSearch: "",
    hasMore: productSearchProps.hasMore,
    loading: productSearchProps.loading,
    onFetchMore: productSearchProps.onFetchMore,
    onSearchChange: productSearchProps.onSearchChange,
  },
  usedBy: {
    active: !!params?.usedBy,
    value: params?.usedBy,
    choices: mapPersonNodeToChoice(customers),
    displayValues: mapPersonNodeToChoice(customers),
    initialSearch: "",
    hasMore: customerSearchProps.hasMore,
    loading: customerSearchProps.loading,
    onFetchMore: customerSearchProps.onFetchMore,
    onSearchChange: customerSearchProps.onSearchChange,
  },
  tag: {
    active: !!params?.tag,
    value: dedupeFilter(params?.tag || []),
    choices: mapSingleValueNodeToChoice(tags),
    displayValues: mapSingleValueNodeToChoice(tags),
    initialSearch: "",
    hasMore: tagSearchProps.hasMore,
    loading: tagSearchProps.loading,
    onFetchMore: tagSearchProps.onFetchMore,
    onSearchChange: tagSearchProps.onSearchChange,
  },
  initialBalanceAmount: {
    active:
      [params.initialBalanceAmountFrom, params.initialBalanceAmountTo].some(
        field => field !== undefined,
      ) || false,
    value: {
      max: params.initialBalanceAmountTo || "",
      min: params.initialBalanceAmountFrom || "",
    },
  },
  currentBalanceAmount: {
    active:
      [params.currentBalanceAmountFrom, params.currentBalanceAmountTo].some(
        field => field !== undefined,
      ) || false,
    value: {
      max: params.currentBalanceAmountTo || "",
      min: params.currentBalanceAmountFrom || "",
    },
  },
  status: {
    active: !!params?.status,
    value: params?.status,
  },
});

export function getFilterQueryParam(
  filter: FilterElement<GiftCardListFilterKeys>,
): GiftCardListUrlFilters {
  const { name } = filter;

  const {
    initialBalanceAmount,
    currentBalanceAmount,
    tag,
    currency,
    usedBy,
    product,
    status,
  } = GiftCardListFilterKeys;

  switch (name) {
    case currency:
    case status:
      return getSingleValueQueryParam(filter, name);

    case tag:
    case product:
    case usedBy:
      return getMultipleValueQueryParam(filter, name);

    case initialBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.initialBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.initialBalanceAmountTo,
      );

    case currentBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.currentBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.currentBalanceAmountTo,
      );
  }
}

export const messages = defineMessages({
  balanceAmountLabel: {
    id: "bVbEZ/",
    defaultMessage: "Amount",
    description: "amount filter label",
  },
  tagLabel: {
    id: "mE+fru",
    defaultMessage: "Tags",
    description: "tag filter label",
  },
  currencyLabel: {
    id: "osPBn1",
    defaultMessage: "Currency",
    description: "currency filter label",
  },
  productLabel: {
    id: "Sjd7wm",
    defaultMessage: "Product",
    description: "product filter label",
  },
  usedByLabel: {
    id: "WMGoqz",
    defaultMessage: "Used by",
    description: "used by filter label",
  },
  statusLabel: {
    id: "D4CsYK",
    defaultMessage: "Status",
    description: "status filter label",
  },
  enabledOptionLabel: {
    id: "vC8vyb",
    defaultMessage: "Enabled",
    description: "enabled status option label",
  },
  disabledOptionLabel: {
    id: "+WTmpr",
    defaultMessage: "Disabled",
    description: "disabled status option label",
  },
  initialBalanceLabel: {
    id: "VceXrc",
    defaultMessage: "Initial balance",
    description: "initial balance filter label",
  },
  currentBalanceLabel: {
    id: "e/61NZ",
    defaultMessage: "Current balance",
    description: "current balance filter label",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: GiftCardListFilterOpts,
): IFilter<GiftCardListFilterKeys> {
  return [
    {
      ...createNumberField(
        GiftCardListFilterKeys.initialBalanceAmount,
        intl.formatMessage(messages.initialBalanceLabel),
        opts.initialBalanceAmount.value,
      ),
      multiple:
        opts?.initialBalanceAmount?.value?.min !==
        opts?.initialBalanceAmount?.value?.max,
      active: opts.initialBalanceAmount.active,
      dependencies: [GiftCardListFilterKeys.currency],
    },

    {
      ...createNumberField(
        GiftCardListFilterKeys.currentBalanceAmount,
        intl.formatMessage(messages.currentBalanceLabel),
        opts.currentBalanceAmount.value,
      ),
      multiple:
        opts?.currentBalanceAmount?.value?.min !==
        opts?.currentBalanceAmount?.value?.max,
      active: opts.currentBalanceAmount.active,
      dependencies: [GiftCardListFilterKeys.currency],
    },
    {
      ...createOptionsField(
        GiftCardListFilterKeys.currency,
        intl.formatMessage(messages.currencyLabel),
        [opts.currency.value],
        false,
        opts.currency.choices,
      ),
      active: opts.currency.active,
    },
    {
      ...createAutocompleteField(
        GiftCardListFilterKeys.tag,
        intl.formatMessage(messages.tagLabel),
        opts.tag.value,
        opts.tag.displayValues,
        true,
        opts.tag.choices,
        {
          hasMore: opts.tag.hasMore,
          initialSearch: "",
          loading: opts.tag.loading,
          onFetchMore: opts.tag.onFetchMore,
          onSearchChange: opts.tag.onSearchChange,
        },
      ),
      active: opts.tag.active,
    },
    {
      ...createAutocompleteField(
        GiftCardListFilterKeys.product,
        intl.formatMessage(messages.productLabel),
        opts.product.value,
        opts.product.displayValues,
        true,
        opts.product.choices,
        {
          hasMore: opts.product.hasMore,
          initialSearch: "",
          loading: opts.product.loading,
          onFetchMore: opts.product.onFetchMore,
          onSearchChange: opts.product.onSearchChange,
        },
      ),
      active: opts.product.active,
    },
    {
      ...createAutocompleteField(
        GiftCardListFilterKeys.usedBy,
        intl.formatMessage(messages.usedByLabel),
        opts.usedBy.value,
        opts.usedBy.displayValues,
        true,
        opts.usedBy.choices,
        {
          hasMore: opts.usedBy.hasMore,
          initialSearch: "",
          loading: opts.usedBy.loading,
          onFetchMore: opts.usedBy.onFetchMore,
          onSearchChange: opts.usedBy.onSearchChange,
        },
      ),
      active: opts.usedBy.active,
    },
    {
      ...createOptionsField(
        GiftCardListFilterKeys.status,
        intl.formatMessage(messages.statusLabel),
        [opts.status.value],
        false,
        [
          {
            label: intl.formatMessage(messages.enabledOptionLabel),
            value: GiftCardStatusFilterEnum.enabled,
          },
          {
            label: intl.formatMessage(messages.disabledOptionLabel),
            value: GiftCardStatusFilterEnum.disabled,
          },
        ],
      ),
      active: opts.status.active,
    },
  ];
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<GiftCardListUrlFilters>(GIFT_CARD_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<GiftCardListUrlQueryParams, GiftCardListUrlFilters>(
  GiftCardListUrlFiltersEnum,
);

export function getFilterVariables({
  status,
  tag,
  usedBy,
  product,
  currency,
  currentBalanceAmountTo,
  currentBalanceAmountFrom,
  initialBalanceAmountTo,
  initialBalanceAmountFrom,
  query,
}: GiftCardListUrlQueryParams): GiftCardFilterInput {
  const balanceData = currency
    ? {
        currentBalance:
          currentBalanceAmountFrom && currentBalanceAmountTo
            ? {
                gte: parseFloat(currentBalanceAmountFrom),
                lte: parseFloat(currentBalanceAmountTo),
              }
            : undefined,
        initialBalance:
          initialBalanceAmountFrom && initialBalanceAmountTo
            ? {
                gte: parseFloat(initialBalanceAmountFrom),
                lte: parseFloat(initialBalanceAmountTo),
              }
            : undefined,
      }
    : {};

  return {
    code: query,
    isActive: !!status ? status === "enabled" : undefined,
    tags: tag,
    usedBy,
    products: product,
    currency,
    ...balanceData,
  };
}
