import React from "react";
import { useIntl } from "react-intl";

import { FieldType, IFilter } from "@saleor/components/Filter";
import FilterBar from "@saleor/components/FilterBar";
import { FilterProps } from "@saleor/types";
import { StockAvailability } from "@saleor/types/globalTypes";
import { ProductListUrlFilters } from "../../urls";

type ProductListFilterProps = FilterProps<ProductListUrlFilters>;

export enum ProductFilterKeys {
  published,
  price,
  priceEqual,
  priceRange,
  stock,
  query
}

const ProductListFilter: React.FC<ProductListFilterProps> = props => {
  const intl = useIntl();

  const filterMenu: IFilter = [
    {
      children: [],
      data: {
        additionalText: intl.formatMessage({
          defaultMessage: "is set as",
          description: "product status is set as"
        }),
        fieldLabel: intl.formatMessage({
          defaultMessage: "Status",
          description: "product status"
        }),
        options: [
          {
            label: intl.formatMessage({
              defaultMessage: "Visible",
              description: "product is visible"
            }),
            value: true
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Hidden",
              description: "product is hidden"
            }),
            value: false
          }
        ],
        type: FieldType.select
      },
      label: intl.formatMessage({
        defaultMessage: "Visibility",
        description: "product visibility"
      }),
      value: ProductFilterKeys.published.toString()
    },
    {
      children: [],
      data: {
        fieldLabel: intl.formatMessage({
          defaultMessage: "Stock quantity"
        }),
        options: [
          {
            label: intl.formatMessage({
              defaultMessage: "Available",
              description: "product status"
            }),
            value: StockAvailability.IN_STOCK
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Out Of Stock",
              description: "product status"
            }),
            value: StockAvailability.OUT_OF_STOCK
          }
        ],
        type: FieldType.select
      },
      label: intl.formatMessage({
        defaultMessage: "Stock",
        description: "product stock"
      }),
      value: ProductFilterKeys.stock.toString()
    },
    {
      children: [
        {
          children: [],
          data: {
            additionalText: intl.formatMessage({
              defaultMessage: "equals",
              description: "product price"
            }),
            fieldLabel: null,
            type: FieldType.price
          },
          label: intl.formatMessage({
            defaultMessage: "Specific Price"
          }),
          value: ProductFilterKeys.priceEqual.toString()
        },
        {
          children: [],
          data: {
            fieldLabel: intl.formatMessage({
              defaultMessage: "Range"
            }),
            type: FieldType.rangePrice
          },
          label: intl.formatMessage({
            defaultMessage: "Range"
          }),
          value: ProductFilterKeys.priceRange.toString()
        }
      ],
      data: {
        fieldLabel: intl.formatMessage({
          defaultMessage: "Price"
        }),
        type: FieldType.range
      },
      label: intl.formatMessage({
        defaultMessage: "Price"
      }),
      value: ProductFilterKeys.price.toString()
    }
  ];

  return <FilterBar {...props} filterMenu={filterMenu} />;
};
ProductListFilter.displayName = "ProductListFilter";
export default ProductListFilter;
