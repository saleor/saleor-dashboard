import {
  moneyCell,
  moneyDiscountedCell,
  readonlyTextCell,
  tagsCell,
  textCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { OrderDraftListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineFragment,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import {
  getDatagridRowDataIndex,
  getStatusColor,
  isFirstColumn,
} from "@dashboard/misc";
import { useOrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import {
  getAttributeColumnValue,
  getAttributeIdFromColumnValue,
} from "@dashboard/products/components/ProductListPage/utils";
import { ListSettings, RelayToFlat } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui/next";
import { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";

import { lineAlertMessages } from "../OrderDraftDetailsProducts/messages";
import { columnsMessages } from "./messages";

export const getColumns = ({
  emptyColumn,
  intl,
  gridAttributes,
  gridAttributesFromSettings,
}: {
  emptyColumn: AvailableColumn;
  intl: IntlShape;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  gridAttributesFromSettings: OrderDraftListColumns[];
}) => [
  emptyColumn,
  {
    id: "product",
    title: intl.formatMessage(columnsMessages.product),
    width: 300,
  },
  {
    id: "sku",
    title: "SKU",
    width: 150,
  },
  {
    id: "quantity",
    title: intl.formatMessage(columnsMessages.quantity),
    width: 80,
  },
  {
    id: "price",
    title: intl.formatMessage(columnsMessages.price),
    width: 150,
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 150,
  },
  {
    id: "status",
    title: "Status",
    width: 250,
  },
  ...gridAttributesFromSettings.map(attributeId => ({
    id: attributeId,
    title:
      gridAttributes.find(gridAttribute => attributeId === gridAttribute.id)
        ?.name ?? "",
    width: 200,
  })),
];

export const useColumnPickerColumns = (
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>,
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >,
  settings: ListSettings<OrderDraftListColumns>,
  defaultColumns: OrderDraftListColumns[],
) => {
  const intl = useIntl();

  const staticColumns = useMemo(
    () =>
      [
        {
          value: "product",
          label: intl.formatMessage(columnsMessages.product),
        },
        {
          value: "sku",
          label: "SKU",
        },
        {
          value: "quantity",
          label: intl.formatMessage(columnsMessages.quantity),
        },
        {
          value: "price",
          label: intl.formatMessage(columnsMessages.price),
        },
        {
          value: "total",
          label: intl.formatMessage(columnsMessages.total),
        },
        {
          value: "status",
          label: "Status",
        },
      ] as const,
    [intl],
  );

  const initialColumns = useMemo(() => {
    const selectedStaticColumns = staticColumns.filter(column =>
      (settings.columns || []).includes(column.value),
    );
    const selectedAttributeColumns = gridAttributes.map(attribute => ({
      label: attribute.name,
      value: getAttributeColumnValue(attribute.id),
    }));

    return [...selectedStaticColumns, ...selectedAttributeColumns];
  }, [gridAttributes, settings.columns, staticColumns]);

  const availableColumns: MultiAutocompleteChoiceType[] = [
    ...staticColumns,
    ...availableInGridAttributes.map(
      attribute =>
        ({
          label: attribute.name,
          value: getAttributeColumnValue(attribute.id),
        } as MultiAutocompleteChoiceType),
    ),
  ];
  return {
    availableColumns,
    initialColumns,
    defaultColumns,
  };
};

interface UseDatagridColumnsProps {
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  gridAttributesFromSettings: OrderDraftListColumns[];
  settings: ListSettings<OrderDraftListColumns>;
}

export const useDatagridColumns = ({
  gridAttributes,
  gridAttributesFromSettings,
  settings,
}: UseDatagridColumnsProps) => {
  const emptyColumn = useEmptyColumn();
  const intl = useIntl();

  const initialColumns = useRef(
    getColumns({
      intl,
      emptyColumn,
      gridAttributes,
      gridAttributesFromSettings,
    }),
  );

  const [columns, setColumns] = useState<AvailableColumn[]>([
    initialColumns.current[0],
    ...initialColumns.current.filter(col =>
      settings.columns.includes(col.id as OrderDraftListColumns),
    ),
  ]);

  useEffect(() => {
    const attributeColumns = gridAttributesFromSettings.map(
      toAttributeColumnData(gridAttributes),
    );

    setColumns(prevColumns => [
      ...prevColumns
        .filter(byColumnsInSettingsOrStaticColumns(settings))
        .map(toCurrentColumnData(attributeColumns)),
      ...settings.columns
        .filter(byNewAddedColumns(prevColumns))
        .map(
          toNewAddedColumData([...initialColumns.current, ...attributeColumns]),
        ),
    ]);
  }, [gridAttributes, gridAttributesFromSettings, settings]);

  return { columns, setColumns };
};

interface GetCellContentProps {
  columns: AvailableColumn[];
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
}

export const useGetCellContent = ({
  columns,
  lines,
  errors,
}: GetCellContentProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const getValues = useOrderLineDiscountContext();

  return (
    [column, row]: Item,
    { added, removed, changes, getChangeIndex }: GetCellContentOpts,
  ): GridCell => {
    if (isFirstColumn(column)) {
      return readonlyTextCell("", false);
    }

    const columnId = columns[column].id;
    const change = changes.current[getChangeIndex(columnId, row)]?.data;
    const rowData = added.includes(row)
      ? undefined
      : lines[getDatagridRowDataIndex(row, removed)];

    if (!rowData) {
      return readonlyTextCell("", false);
    }

    const { unitUndiscountedPrice, unitDiscountedPrice } = getValues(
      rowData.id,
    );

    if (columnId.startsWith("attribute")) {
      return getAttributeCellContent(columnId, rowData);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
          {
            readonly: true,
            allowOverlay: false,
          },
        );
      case "quantity":
        return textCell(change || rowData.quantity.toString());
      case "price":
        return moneyDiscountedCell(
          {
            value: unitDiscountedPrice.amount,
            currency: unitDiscountedPrice.currency,
            undiscounted: unitUndiscountedPrice.amount,
            lineItemId: rowData.id,
            locale,
          },
          {
            allowOverlay: true,
          },
        );
      case "status":
        const orderErrors = getOrderErrors(errors, rowData.id);
        const status = getOrderLineStatus(intl, rowData, orderErrors);

        return tagsCell(
          status.map(toTagValue(theme)),
          status.map(status => status.status),
          {
            readonly: true,
            allowOverlay: false,
          },
        );
      case "sku":
        return readonlyTextCell(rowData?.productSku ?? "", false);
      case "total":
        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
          {
            readonly: true,
            allowOverlay: false,
          },
        );

      default:
        return readonlyTextCell("", false);
    }
  };
};

function getAttributeCellContent(columnId: string, rowData: OrderLineFragment) {
  const attributeId = getAttributeIdFromColumnValue(columnId);
  const productAttribute = rowData?.variant.attributes.find(
    attribute => attribute.attribute.id === attributeId,
  );

  if (productAttribute) {
    if (productAttribute.values.length) {
      if (productAttribute.values[0].date) {
        return readonlyTextCell(productAttribute.values[0].date);
      }
      if (productAttribute.values[0].dateTime) {
        return readonlyTextCell(productAttribute.values[0].dateTime);
      }
    }

    const textValue = productAttribute.values
      .map(value => value.name)
      .join(", ");

    return readonlyTextCell(textValue);
  }

  return readonlyTextCell("");
}

function toTagValue(currentTheme: DefaultTheme) {
  return ({ status, type }: OrderStatus) => ({
    color: getStatusColor(type, currentTheme),
    tag: status,
  });
}

interface OrderStatus {
  type: "warning" | "error";
  status: string;
}

const getOrderLineStatus = (
  intl: IntlShape,
  line: OrderDetailsFragment["lines"][number],
  error?: OrderErrorFragment,
): OrderStatus[] => {
  const statuses = [];

  if (error) {
    statuses.push({
      type: "error",
      status: getOrderErrorMessage(error, intl),
    });
  }

  const product = line.variant?.product;

  if (!product) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notExists),
    });
  }

  const isAvailableForPurchase = product?.isAvailableForPurchase;

  if (product && !isAvailableForPurchase) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notAvailable),
    });
  }

  return statuses;
};

function getOrderErrors(errors: OrderErrorFragment[], id: string) {
  return errors.find(error => error.orderLines?.some(lineId => lineId === id));
}

function byNewAddedColumns(currentColumns: AvailableColumn[]) {
  return (column: OrderDraftListColumns) =>
    !currentColumns.find(c => c.id === column);
}

function byColumnsInSettingsOrStaticColumns(
  settings: ListSettings<OrderDraftListColumns>,
) {
  return (column: AvailableColumn) =>
    settings.columns.includes(column.id as OrderDraftListColumns) ||
    ["name"].includes(column.id);
}

function toCurrentColumnData(attributeColumns: AvailableColumn[]) {
  return (column: AvailableColumn) => {
    // Take newest attibutes data from attributeColumns
    if (column.id.startsWith("attribute")) {
      return attributeColumns.find(ac => ac.id === column.id);
    }

    return column;
  };
}

function toNewAddedColumData(columnSource: AvailableColumn[]) {
  return (column: OrderDraftListColumns) => ({
    ...columnSource.find(ac => ac.id === column),
  });
}

export function toAttributeColumnData(
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>,
) {
  return (attribute: OrderDraftListColumns) => {
    const attributeId = getAttributeIdFromColumnValue(attribute);

    const title =
      gridAttributes.find(gridAttribute => attributeId === gridAttribute.id)
        ?.name ?? "";

    return {
      id: attribute,
      title,
      width: 200,
    };
  };
}
