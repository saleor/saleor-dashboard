import { type AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { AssignableListPagination } from "@dashboard/components/AssignableListTable/AssignableListPagination";
import {
  ASSIGNABLE_LIST_TABLE_ACTION_INSET,
  ASSIGNABLE_LIST_TABLE_EMPTY_PADDING,
} from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SearchInput } from "@dashboard/components/SearchInput/SearchInput";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { stopTableRowLinkNavigation } from "@dashboard/components/TableRowLink/stopTableRowLinkNavigation";
import { PAGINATE_BY } from "@dashboard/config";
import {
  type AttributeErrorFragment,
  AttributeInputTypeEnum,
  type AttributeValueListFragment,
} from "@dashboard/graphql";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { renderCollection } from "@dashboard/misc";
import {
  type ListActions,
  type ListProps,
  type PaginateListProps,
  type RelayToFlat,
  type ReorderAction,
} from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type MouseEvent, useMemo } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { AttributeValueInlineAdd } from "../AttributeValueInlineAdd/AttributeValueInlineAdd";
import { SwatchPreview } from "../SwatchPreview/SwatchPreview";
import styles from "./AttributeValues.module.css";

const embeddedMessages = defineMessages({
  valuesSectionHint: {
    id: "V8M174",
    defaultMessage: "The choices merchants can select. Add at least one.",
    description: "embedded attribute values section hint",
  },
  swatchValuesSectionHint: {
    id: "qnwUm+",
    defaultMessage:
      "Each choice needs a name and a color or image. Add at least one before continuing.",
    description: "embedded swatch attribute values section hint",
  },
});

export type AttributeValuesAddMode = "dialog" | "inline";
export type AttributeValuesVariant = "card" | "embedded";

interface AttributeValuesProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    PaginateListProps,
    ListActions {
  addMode?: AttributeValuesAddMode;
  attributeName?: string;
  disabled: boolean;
  inlineValueAddError?: AttributeErrorFragment | null;
  values?: RelayToFlat<AttributeValueListFragment>;
  onInlineValueAdd?: (data: AttributeValueEditDialogFormData) => void;
  onInlineValuesAdd?: (data: AttributeValueEditDialogFormData[]) => void;
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
  inputType: AttributeInputTypeEnum;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  variant?: AttributeValuesVariant;
}

const useStyles = makeStyles(
  {
    columnSwatch: {
      width: 100,
    },
    columnAdmin: {
      width: 300,
    },
    columnStore: {
      width: "auto",
    },
    iconCell: {
      width: 48,
    },
    link: {
      cursor: "pointer",
    },
  },
  { name: "AttributeValues" },
);

const getColumnClassName = (
  classes: ReturnType<typeof useStyles>,
  isEmbedded: boolean,
  column: "swatch" | "admin" | "store" | "icon",
) => {
  const baseClassMap = {
    swatch: classes.columnSwatch,
    admin: classes.columnAdmin,
    store: classes.columnStore,
    icon: classes.iconCell,
  };
  const embeddedClassMap = {
    swatch: styles.embeddedColumnSwatch,
    admin: styles.embeddedColumnAdmin,
    store: styles.embeddedColumnStore,
    icon: styles.embeddedColumnIcon,
  };

  return clsx(baseClassMap[column], isEmbedded && embeddedClassMap[column]);
};

const stopRowClick = (event: MouseEvent): void => {
  stopTableRowLinkNavigation(event);
};

const AttributeValues = ({
  addMode = "dialog",
  attributeName,
  disabled,
  inlineValueAddError = null,
  isChecked,
  onInlineValueAdd,
  onInlineValuesAdd,
  onValueAdd,
  onValueDelete,
  onValueReorder,
  onValueUpdate,
  selected,
  toggle,
  toggleAll,
  toolbar,
  values,
  settings,
  onUpdateListSettings,
  pageInfo,
  onNextPage,
  onPreviousPage,
  inputType,
  searchQuery = "",
  onSearchChange,
  variant = "card",
}: AttributeValuesProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const isInlineAdd = addMode === "inline";
  const isEmbedded = variant === "embedded";
  const numberOfColumns = isSwatch ? 6 : 5;
  const inlineColumnSpan = numberOfColumns;
  const showSearch = Boolean(onSearchChange);
  const hasValueRows = Boolean(values?.length);
  const showValuesTable = isInlineAdd || hasValueRows || Boolean(searchQuery);
  const showPagination = !isInlineAdd && hasValueRows && Boolean(onUpdateListSettings);
  const paginatorValue = useMemo(
    () => ({
      paginatorType: "click" as const,
      hasNextPage: Boolean(pageInfo && !disabled && pageInfo.hasNextPage),
      hasPreviousPage: Boolean(pageInfo && !disabled && pageInfo.hasPreviousPage),
      loadNextPage: onNextPage,
      loadPreviousPage: onPreviousPage,
    }),
    [disabled, onNextPage, onPreviousPage, pageInfo],
  );

  const tableHead = (
    <TableHead
      colSpan={numberOfColumns}
      compact
      disabled={disabled}
      dragRows
      items={values}
      keepColumnHeaders={!isEmbedded}
      selected={selected}
      toggleAll={toggleAll}
      toolbar={isEmbedded ? toolbar : undefined}
    >
      {isSwatch ? (
        <TableCell className={getColumnClassName(classes, isEmbedded, "swatch")}>
          <Text size={2} lineHeight={2} color="default2">
            <FormattedMessage
              id="NUevU9"
              defaultMessage="Swatch"
              description="attribute values list: slug column header"
            />
          </Text>
        </TableCell>
      ) : null}
      <TableCell className={getColumnClassName(classes, isEmbedded, "admin")}>
        <Text size={2} lineHeight={2} color="default2">
          <FormattedMessage
            id="3psvRS"
            defaultMessage="Admin"
            description="attribute values list: slug column header"
          />
        </Text>
      </TableCell>
      {selected > 0 && !isEmbedded ? (
        <TableCell colSpan={2} className={styles.bulkHeaderCell}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
            height="100%"
            paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
          >
            <Text data-test-id="SelectedText" size={2} lineHeight={2}>
              <FormattedMessage
                id="imYtnq"
                defaultMessage="Selected {number, plural, one {# item} other {# items}}"
                values={{
                  number: selected,
                }}
              />
            </Text>
            {toolbar ? (
              <Box data-test-id="bulk-delete-button" display="flex" alignItems="center">
                {toolbar}
              </Box>
            ) : null}
          </Box>
        </TableCell>
      ) : (
        <>
          <TableCell className={getColumnClassName(classes, isEmbedded, "store")}>
            <Text size={2} lineHeight={2} color="default2">
              <FormattedMessage
                id="H60H6L"
                defaultMessage="Default Store View"
                description="attribute values list: name column header"
              />
            </Text>
          </TableCell>
          <TableCell className={getColumnClassName(classes, isEmbedded, "icon")} />
        </>
      )}
    </TableHead>
  );

  const valueRows = (
    <SortableTableBody onSortEnd={onValueReorder} disabled={!!searchQuery}>
      {renderCollection(values, (value, valueIndex) => {
        const isSelected = value ? Boolean(isChecked(value.id)) : false;

        return (
          <SortableTableRow
            data-test-id="attributes-rows"
            className={clsx(
              value && !isInlineAdd ? classes.link : undefined,
              isEmbedded && styles.embeddedRow,
              tableStyles.row,
            )}
            hover={!!value && !isInlineAdd}
            onClick={value && !isInlineAdd ? () => onValueUpdate(value.id) : undefined}
            key={value?.id}
            id={value?.id ?? `value-${valueIndex}`}
            index={valueIndex || 0}
            selected={isSelected}
          >
            <TableCell className={tableStyles.checkboxCell} onClick={stopRowClick}>
              <Box display="flex" alignItems="center" height="100%">
                <Checkbox
                  checked={isSelected}
                  disabled={disabled || !value}
                  onCheckedChange={() => {
                    if (value) {
                      toggle(value.id);
                    }
                  }}
                />
              </Box>
            </TableCell>
            {isSwatch ? (
              <TableCell className={getColumnClassName(classes, isEmbedded, "swatch")}>
                <Box className={clsx(styles.embeddedCell, isEmbedded && styles.embeddedCellCenter)}>
                  <SwatchPreview
                    color={value?.file ? null : value?.value}
                    imageUrl={value?.file?.url}
                    size={32}
                  />
                </Box>
              </TableCell>
            ) : null}
            <TableCell
              className={getColumnClassName(classes, isEmbedded, "admin")}
              data-test-id="attribute-value-name"
            >
              <Box className={isEmbedded ? styles.embeddedCell : undefined}>
                {value?.slug ? (
                  <Text size={3} color="default2">
                    {value.slug}
                  </Text>
                ) : (
                  <Skeleton />
                )}
              </Box>
            </TableCell>
            <TableCell className={getColumnClassName(classes, isEmbedded, "store")}>
              <Box className={isEmbedded ? styles.embeddedCell : undefined}>
                {value?.name ?? <Skeleton />}
              </Box>
            </TableCell>
            <TableCell
              className={clsx(
                getColumnClassName(classes, isEmbedded, "icon"),
                tableStyles.actionsCell,
              )}
            >
              <Box
                className={clsx(
                  tableStyles.rowDelete,
                  isEmbedded && styles.embeddedCell,
                  isEmbedded && styles.embeddedCellEnd,
                )}
                display="flex"
                justifyContent="flex-end"
                paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
                width="100%"
              >
                <TableButtonWrapper>
                  <Button
                    data-test-id="delete-attribute-value-button"
                    disabled={disabled}
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                    onClick={() => onValueDelete(value?.id ?? "")}
                    size="small"
                    variant="tertiary"
                  />
                </TableButtonWrapper>
              </Box>
            </TableCell>
          </SortableTableRow>
        );
      })}
    </SortableTableBody>
  );

  const showInlineAddInTable = isInlineAdd && onInlineValueAdd && !isSwatch;
  const showInlineAddSection = isInlineAdd && onInlineValueAdd && isSwatch;

  const inlineAddProps = {
    columnSpan: inlineColumnSpan,
    disabled,
    error: inlineValueAddError,
    hasRowsAbove: hasValueRows,
    inputType,
    onAdd: onInlineValueAdd!,
    onAddMany: onInlineValuesAdd,
  };

  const valuesTable = (
    <Box
      className={showInlineAddSection && hasValueRows ? styles.valuesTableWithSection : undefined}
      display="flex"
      flexDirection="column"
    >
      {hasValueRows || showInlineAddInTable ? (
        <ResponsiveTable
          // Card variant bleeds into AssignableListCard. The create-modal
          // (embedded) table keeps ResponsiveTable's bordered well — same
          // chrome as the Properties card below it.
          bleed={!isEmbedded}
          className={clsx(
            !isEmbedded && tableStyles.assignableTable,
            isEmbedded && styles.embeddedTable,
          )}
        >
          {hasValueRows || showInlineAddInTable ? (
            <colgroup>
              <col className={tableStyles.dragCell} />
              <col className={tableStyles.checkboxCell} />
              {isSwatch ? <col /> : null}
              <col />
              <col />
              <col className={tableStyles.actionsCell} />
            </colgroup>
          ) : null}
          {hasValueRows ? (
            <>
              {tableHead}
              {valueRows}
            </>
          ) : null}
          {showInlineAddInTable ? (
            <AttributeValueInlineAdd {...inlineAddProps} variant="tableFooter" />
          ) : null}
        </ResponsiveTable>
      ) : null}
      {showInlineAddSection ? (
        <AttributeValueInlineAdd {...inlineAddProps} variant="section" />
      ) : null}
    </Box>
  );

  const emptyState = searchQuery ? (
    <Placeholder>
      <FormattedMessage
        id="oegjWf"
        defaultMessage="No values match your search"
        description="attribute values list: no search results"
      />
    </Placeholder>
  ) : (
    <Placeholder>
      <FormattedMessage
        id="dAst+b"
        defaultMessage="No values found"
        description="attribute values list: no attribute values found"
      />
    </Placeholder>
  );

  const searchField = showSearch ? (
    <SearchInput
      value={searchQuery}
      onChange={onSearchChange!}
      placeholder={intl.formatMessage({
        id: "9seX5T",
        defaultMessage: "Search attribute values...",
        description: "attribute values search placeholder",
      })}
      data-test-id="attribute-value-search-input"
    />
  ) : null;

  const valuesBody =
    values === undefined ? (
      <Skeleton />
    ) : !showValuesTable && !searchQuery ? (
      emptyState
    ) : values?.length === 0 && searchQuery ? (
      emptyState
    ) : (
      valuesTable
    );

  if (isEmbedded) {
    return (
      <Box data-test-id="attribute-values-section" display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexDirection="column" gap={1}>
          {attributeName ? (
            <Text size={3} fontWeight="bold">
              <FormattedMessage
                id="Y3UhI+"
                defaultMessage="Values for {name}"
                description="embedded attribute values section title"
                values={{ name: attributeName }}
              />
            </Text>
          ) : null}
          <Text size={3} color="default2">
            <FormattedMessage
              {...(isSwatch
                ? embeddedMessages.swatchValuesSectionHint
                : embeddedMessages.valuesSectionHint)}
            />
          </Text>
        </Box>
        <Box display="flex" flexDirection="column" gap={4}>
          {searchField}
          {valuesBody}
        </Box>
      </Box>
    );
  }

  return (
    <PaginatorContext.Provider value={paginatorValue}>
      <AssignableListCard
        data-test-id="attribute-values-section"
        title={intl.formatMessage({
          id: "J3uE0t",
          defaultMessage: "Attribute Values",
          description: "section header",
        })}
        headerEnd={
          !isInlineAdd ? (
            <Button
              disabled={disabled}
              variant="secondary"
              type="button"
              onClick={onValueAdd}
              data-test-id="assign-value-button"
            >
              <FormattedMessage
                id="+iVKR1"
                defaultMessage="Assign value"
                description="assign attribute value button"
              />
            </Button>
          ) : undefined
        }
        search={searchField}
        footer={
          showPagination && onUpdateListSettings ? (
            <AssignableListPagination
              inset="drag"
              numberOfRows={settings?.rowNumber ?? PAGINATE_BY}
              onUpdateListSettings={onUpdateListSettings}
            />
          ) : null
        }
      >
        {values === undefined ? (
          <Box padding={6}>
            <Skeleton />
          </Box>
        ) : !showValuesTable || (values?.length === 0 && searchQuery) ? (
          <Box padding={ASSIGNABLE_LIST_TABLE_EMPTY_PADDING}>{emptyState}</Box>
        ) : (
          valuesTable
        )}
      </AssignableListCard>
    </PaginatorContext.Provider>
  );
};

AttributeValues.displayName = "AttributeValues";
export { AttributeValues };
