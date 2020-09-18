import { IFilter } from "@saleor/components/Filter";
import { commonMessages } from "@saleor/intl";
import { FilterOpts } from "@saleor/types";
import { createBooleanField } from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum AttributeFilterKeys {
  availableInGrid = "availableInGrid",
  filterableInDashboard = "filterableInDashboard",
  filterableInStorefront = "filterableInStorefront",
  isVariantOnly = "isVariantOnly",
  valueRequired = "valueRequired",
  visibleInStorefront = "visibleInStorefront"
}

export interface AttributeListFilterOpts {
  availableInGrid: FilterOpts<boolean>;
  filterableInDashboard: FilterOpts<boolean>;
  filterableInStorefront: FilterOpts<boolean>;
  isVariantOnly: FilterOpts<boolean>;
  valueRequired: FilterOpts<boolean>;
  visibleInStorefront: FilterOpts<boolean>;
}

const messages = defineMessages({
  availableInGrid: {
    defaultMessage: "Can be used as column",
    description: "attribute can be column in product list table"
  },
  filterableInDashboard: {
    defaultMessage: "Filterable in Dashboard",
    description: "use attribute in filtering"
  },
  filterableInStorefront: {
    defaultMessage: "Filterable in Storefront",
    description: "use attribute in filtering"
  },
  isVariantOnly: {
    defaultMessage: "Variant Only",
    description: "attribute can be used only in variants"
  },
  valueRequired: {
    defaultMessage: "Value Required",
    description: "attribute value is required"
  },
  visibleInStorefront: {
    defaultMessage: "Visible on Product Page in Storefront",
    description: "attribute"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: AttributeListFilterOpts
): IFilter<AttributeFilterKeys> {
  return [
    {
      ...createBooleanField(
        AttributeFilterKeys.availableInGrid,
        intl.formatMessage(messages.availableInGrid),
        opts.availableInGrid.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.availableInGrid.active
    },
    {
      ...createBooleanField(
        AttributeFilterKeys.filterableInDashboard,
        intl.formatMessage(messages.filterableInDashboard),
        opts.filterableInDashboard.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.filterableInDashboard.active
    },
    {
      ...createBooleanField(
        AttributeFilterKeys.filterableInStorefront,
        intl.formatMessage(messages.filterableInStorefront),
        opts.filterableInStorefront.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.filterableInStorefront.active
    },
    {
      ...createBooleanField(
        AttributeFilterKeys.isVariantOnly,
        intl.formatMessage(messages.isVariantOnly),
        opts.isVariantOnly.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.isVariantOnly.active
    },
    {
      ...createBooleanField(
        AttributeFilterKeys.valueRequired,
        intl.formatMessage(messages.valueRequired),
        opts.valueRequired.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.valueRequired.active
    },
    {
      ...createBooleanField(
        AttributeFilterKeys.visibleInStorefront,
        intl.formatMessage(messages.visibleInStorefront),
        opts.visibleInStorefront.value,
        {
          negative: intl.formatMessage(commonMessages.no),
          positive: intl.formatMessage(commonMessages.yes)
        }
      ),
      active: opts.visibleInStorefront.active
    }
  ];
}
