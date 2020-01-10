import { defineMessages, IntlShape } from "react-intl";

import { FilterOpts } from "@saleor/types";
import {
  ProductTypeConfigurable,
  ProductTypeEnum
} from "@saleor/types/globalTypes";
import { IFilter } from "@saleor/components/Filter";
import { commonMessages } from "@saleor/intl";
import { createOptionsField } from "@saleor/utils/filters/fields";

export enum ProductTypeFilterKeys {
  configurable = "configurable",
  type = "type"
}

export interface ProductTypeListFilterOpts {
  configurable: FilterOpts<ProductTypeConfigurable>;
  type: FilterOpts<ProductTypeEnum>;
}

const messages = defineMessages({
  configurable: {
    defaultMessage: "Configurable",
    description: "product type"
  },
  digital: {
    defaultMessage: "Digital",
    description: "product"
  },
  shippable: {
    defaultMessage: "Shippable",
    description: "product"
  },
  type: {
    defaultMessage: "Type",
    description: "product type is digital or physical"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: ProductTypeListFilterOpts
): IFilter<ProductTypeFilterKeys> {
  return [
    {
      ...createOptionsField(
        ProductTypeFilterKeys.configurable,
        intl.formatMessage(messages.configurable),
        [opts.configurable.value],
        false,
        [
          {
            label: intl.formatMessage(commonMessages.yes),
            value: ProductTypeConfigurable.CONFIGURABLE
          },
          {
            label: intl.formatMessage(commonMessages.no),
            value: ProductTypeConfigurable.SIMPLE
          }
        ]
      ),
      active: opts.configurable.active
    },
    {
      ...createOptionsField(
        ProductTypeFilterKeys.type,
        intl.formatMessage(messages.type),
        [opts.type.value],
        false,
        [
          {
            label: intl.formatMessage(messages.digital),
            value: ProductTypeEnum.DIGITAL
          },
          {
            label: intl.formatMessage(messages.shippable),
            value: ProductTypeEnum.SHIPPABLE
          }
        ]
      ),
      active: opts.type.active
    }
  ];
}
