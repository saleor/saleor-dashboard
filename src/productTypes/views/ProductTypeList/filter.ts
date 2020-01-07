import { IntlShape } from "react-intl";

import {
  ProductTypeFilterInput,
  ProductTypeConfigurable,
  ProductTypeEnum
} from "@saleor/types/globalTypes";
import { IFilterElement, IFilter } from "@saleor/components/Filter";
import { maybe, findValueInEnum } from "@saleor/misc";
import { createOptionsField } from "@saleor/utils/filters/fields";
import { commonMessages } from "@saleor/intl";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  ProductTypeListUrlFilters,
  ProductTypeListUrlFiltersEnum,
  ProductTypeListUrlQueryParams
} from "../../urls";
import { ProductTypeListFilterOpts } from "../../types";
import messages from "./messages";

export const PRODUCT_TYPE_FILTERS_KEY = "productTypeFilters";

export enum ProductTypeFilterKeys {
  configurable = "configurable",
  type = "type"
}

export function getFilterOpts(
  params: ProductTypeListUrlFilters
): ProductTypeListFilterOpts {
  return {
    configurable: {
      active: !!maybe(() => params.configurable),
      value: maybe(() =>
        findValueInEnum(params.configurable, ProductTypeConfigurable)
      )
    },
    type: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, ProductTypeEnum))
    }
  };
}

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

export function getFilterVariables(
  params: ProductTypeListUrlFilters
): ProductTypeFilterInput {
  return {
    configurable: params.configurable
      ? findValueInEnum(params.configurable, ProductTypeConfigurable)
      : undefined,
    productType: params.type
      ? findValueInEnum(params.type, ProductTypeEnum)
      : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductTypeFilterKeys>
): ProductTypeListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case ProductTypeFilterKeys.configurable:
      if (!active) {
        return {
          configurable: undefined
        };
      }

      return {
        configurable: value[0]
      };

    case ProductTypeFilterKeys.type:
      if (!active) {
        return {
          type: undefined
        };
      }

      return {
        type: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductTypeListUrlFilters>(PRODUCT_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlFilters
>(ProductTypeListUrlFiltersEnum);
