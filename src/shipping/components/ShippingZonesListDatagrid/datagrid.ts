import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { moneyCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { getMoneyRange } from "@dashboard/components/MoneyRange";
import { ShippingZoneFragment } from "@dashboard/graphql";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { messages } from "./messages";

export const shippingZonesListStaticColumnsAdapter = (intl: IntlShape) => [
  {
    id: "name",
    title: intl.formatMessage(messages.colName),
    width: 450,
  },
  {
    id: "priceRange",
    title: intl.formatMessage(messages.colPriceRange),
    width: 200,
  },
  {
    id: "countries",
    title: intl.formatMessage(messages.colCountries),
    width: 200,
  },
];

export const createGetCellContent =
  ({
    shippingZones,
    columns,
    intl,
    locale,
  }: {
    shippingZones: ShippingZoneFragment[] | undefined;
    columns: AvailableColumn[];
    intl: IntlShape;
    locale: Locale;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: ShippingZoneFragment | undefined = shippingZones?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData?.name ?? PLACEHOLDER);

      case "priceRange": {
        const from = rowData?.priceRange?.start;
        const to = rowData?.priceRange?.stop;

        if (!from) {
          return readonlyTextCell("");
        }

        const isRange = !!to;

        // TODO: update with moneyCell when it's ready to handle ranges
        return isRange
          ? readonlyTextCell(getMoneyRange(locale, intl, from, to))
          : moneyCell(from.amount, from.currency);
      }
      case "countries":
        return readonlyTextCell(rowData?.countries.length.toString() ?? PLACEHOLDER);
      default:
        return readonlyTextCell("");
    }
  };
