import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { numberCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import Datagrid, { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { Item } from "@glideapps/glide-data-grid";
import { Box, Multiselect, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { getSizeParametersOptions } from "./consts";
import { variantsStaticColumnsAdapter } from "./datagrid";
import messages from "./messages";
import { ClothingSize, ProductSizeTableError, TSizeTable } from "./types";
import { getError } from "./utils";

type Props = {
  initSizeTable: TSizeTable;
  sizeProperties: Option[];
  errors: ProductSizeTableError[];
  onSizePropertiesChange: (value: Option[]) => void;
  onChangeSizeTableData: (data: DatagridChangeOpts) => void;
};

export const ProductSizeTableCard: React.FC<Props> = ({
  initSizeTable,
  sizeProperties,
  errors,
  onSizePropertiesChange,
  onChangeSizeTableData,
}) => {
  const intl = useIntl();

  return (
    <>
      <Box
        paddingX={6}
        gap={2}
        paddingTop={6}
        paddingBottom={4}
        display="flex"
        flexDirection="column"
      >
        <Text size={5} fontWeight="bold">
          {intl.formatMessage(messages.title)}
        </Text>
        <ProductSizePropertiesSelect
          onSizePropertiesChange={onSizePropertiesChange}
          sizeProperties={sizeProperties}
        />
      </Box>
      <ProductSizeTable
        sizeTable={initSizeTable}
        errors={errors}
        onRowClick={function (id: string): void {
          // eslint-disable-next-line no-console
          console.log("on row click id:", id);
        }}
        onChangeSizeTableData={onChangeSizeTableData}
      />
    </>
  );
};

const ProductSizePropertiesSelect: React.FC<
  Pick<Props, "onSizePropertiesChange" | "sizeProperties">
> = ({ onSizePropertiesChange, sizeProperties }) => {
  const intl = useIntl();

  return (
    <BasicAttributeRow label={intl.formatMessage(messages.sizeParameters)}>
      <Multiselect
        disabled={false}
        name={"sizeProperties"}
        // label="Size Properties"
        error={false}
        // helperText={getErrorMessage(error, intl)}
        options={getSizeParametersOptions(intl)}
        value={sizeProperties}
        onChange={choices => {
          onSizePropertiesChange(choices);
        }}
      />
    </BasicAttributeRow>
  );
};

type ProductSizeTableProps = {
  sizeTable: TSizeTable;
  errors: ProductSizeTableError[];
  onRowClick: (id: string) => void;
} & Pick<Props, "onChangeSizeTableData">;

const ProductSizeTable: React.FC<ProductSizeTableProps> = ({
  sizeTable,
  errors,
  onChangeSizeTableData,
}) => {
  const intl = useIntl();

  const isTableLoaded = React.useMemo(
    () => Object.values(sizeTable).filter(v => !!v).length > 0,
    [sizeTable],
  );

  const initialSettings = React.useMemo(
    () =>
      // eslint-disable-next-line no-extra-boolean-cast
      isTableLoaded
        ? ["size", ...Object.keys(Object.values(sizeTable).filter(v => !!v)[0] || {})]
        : undefined,
    [sizeTable],
  );

  const [columnSettings] = useStateFromProps<string[] | undefined>(initialSettings);

  const memoizedStaticColumns = React.useMemo(
    () =>
      variantsStaticColumnsAdapter(
        intl,
        isTableLoaded ? Object.keys(Object.values(sizeTable).filter(v => !!v)[0] || {}) : [],
      ),
    [intl, isTableLoaded, sizeTable],
  );

  const { handlers, visibleColumns, recentlyAddedColumn } = useColumns({
    gridName: "sizes",
    staticColumns: memoizedStaticColumns,
    columnCategories: [],
    selectedColumns: columnSettings ?? [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSave: () => {},
  });

  const getCellContent = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) => {
      const columnId = visibleColumns[column]?.id;
      const change = opts.changes.current[opts.getChangeIndex(columnId, row)]?.data;
      const dataRow =
        opts.added.includes(row) || !isTableLoaded
          ? undefined
          : Object.entries(sizeTable).filter(
              ([_, sizeRowData], index) => !!sizeRowData && !opts.removed.includes(index),
            )[row];

      const value = change?.value ?? dataRow?.[1]?.[columnId] ?? numberCellEmptyValue;

      if (columnId === "size") {
        return readonlyTextCell(dataRow ? dataRow[0].toUpperCase() : "");
      }

      return numberCell(value);
    },
    [visibleColumns, sizeTable, isTableLoaded],
  );

  const getCellError = React.useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getError(errors, {
        availableColumns: visibleColumns,
        column,
        row,
        sizes: Object.keys(sizeTable).filter(k => sizeTable[k] !== undefined) as ClothingSize[],
        ...opts,
      }),
    [errors, visibleColumns],
  );

  return (
    <Datagrid
      fillHandle={false}
      // renderHeader={props => <ProductSizeTableHeader {...props} productName={productName} />}
      availableColumns={visibleColumns}
      emptyText={intl.formatMessage(messages.empty)}
      getCellContent={getCellContent}
      getCellError={getCellError}
      menuItems={() => []}
      rows={Object.values(sizeTable)?.filter(v => !!v)?.length ?? 0}
      selectionActions={() => null}
      columnSelect="none"
      onColumnResize={handlers.onResize}
      onColumnMoved={handlers.onMove}
      rowMarkers="number"
      onChange={d => {
        onChangeSizeTableData(d);
      }}
      recentlyAddedColumn={recentlyAddedColumn}
    />
  );
};
