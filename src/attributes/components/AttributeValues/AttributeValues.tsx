import { type AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SearchInput } from "@dashboard/components/SearchInput/SearchInput";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import { TablePagination } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  type AttributeErrorFragment,
  AttributeInputTypeEnum,
  type AttributeValueListFragment,
} from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import {
  type ListProps,
  type PaginateListProps,
  type RelayToFlat,
  type ReorderAction,
} from "@dashboard/types";
import { TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
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
    PaginateListProps {
  addMode?: AttributeValuesAddMode;
  attributeName?: string;
  disabled: boolean;
  inlineValueAddError?: AttributeErrorFragment | null;
  values?: RelayToFlat<AttributeValueListFragment>;
  onInlineValueAdd?: (data: AttributeValueEditDialogFormData) => void;
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
  theme => ({
    columnSwatch: {
      width: 100,
    },
    columnAdmin: {
      width: 300,
    },
    columnDrag: {
      width: theme.spacing(6 + 1.5),
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
  }),
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

const AttributeValues = ({
  addMode = "dialog",
  attributeName,
  disabled,
  inlineValueAddError = null,
  onInlineValueAdd,
  onValueAdd,
  onValueDelete,
  onValueReorder,
  onValueUpdate,
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
  const inlineColumnSpan = isSwatch ? 5 : 4;
  const showSearch = Boolean(onSearchChange);
  const hasValueRows = Boolean(values?.length);
  const showValuesTable = isInlineAdd || hasValueRows || Boolean(searchQuery);

  const tableHead = (
    <TableHead>
      <TableRowLink>
        <TableCell className={classes.columnDrag} />
        {isSwatch ? (
          <TableCell className={getColumnClassName(classes, isEmbedded, "swatch")}>
            <FormattedMessage
              id="NUevU9"
              defaultMessage="Swatch"
              description="attribute values list: slug column header"
            />
          </TableCell>
        ) : null}
        <TableCell className={getColumnClassName(classes, isEmbedded, "admin")}>
          <FormattedMessage
            id="3psvRS"
            defaultMessage="Admin"
            description="attribute values list: slug column header"
          />
        </TableCell>
        <TableCell className={getColumnClassName(classes, isEmbedded, "store")}>
          <FormattedMessage
            id="H60H6L"
            defaultMessage="Default Store View"
            description="attribute values list: name column header"
          />
        </TableCell>
        <TableCell className={getColumnClassName(classes, isEmbedded, "icon")} />
      </TableRowLink>
    </TableHead>
  );

  const valueRows = (
    <SortableTableBody onSortEnd={onValueReorder} disabled={!!searchQuery}>
      {renderCollection(values, (value, valueIndex) => (
        <SortableTableRow<"row">
          data-test-id="attributes-rows"
          className={clsx(
            value && !isInlineAdd ? classes.link : undefined,
            isEmbedded && styles.embeddedRow,
          )}
          hover={!!value && !isInlineAdd}
          onClick={value && !isInlineAdd ? () => onValueUpdate(value.id) : undefined}
          key={value?.id}
          index={valueIndex || 0}
        >
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
              {value?.slug ?? <Skeleton />}
            </Box>
          </TableCell>
          <TableCell className={getColumnClassName(classes, isEmbedded, "store")}>
            <Box className={isEmbedded ? styles.embeddedCell : undefined}>
              {value?.name ?? <Skeleton />}
            </Box>
          </TableCell>
          <TableCell
            className={clsx(getColumnClassName(classes, isEmbedded, "icon"), tableStyles.colAction)}
          >
            <Box
              className={clsx(
                isEmbedded && styles.embeddedCell,
                isEmbedded && styles.embeddedCellEnd,
              )}
              display="flex"
              justifyContent="flex-end"
              width="100%"
            >
              <TableButtonWrapper>
                <Button
                  data-test-id="delete-attribute-value-button"
                  disabled={disabled}
                  icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
                  onClick={() => onValueDelete(value?.id ?? "")}
                  variant="tertiary"
                />
              </TableButtonWrapper>
            </Box>
          </TableCell>
        </SortableTableRow>
      ))}
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
  };

  const valuesTable = (
    <Box
      className={showInlineAddSection && hasValueRows ? styles.valuesTableWithSection : undefined}
      display="flex"
      flexDirection="column"
    >
      {hasValueRows || showInlineAddInTable ? (
        <ResponsiveTable
          className={isEmbedded ? styles.embeddedTable : undefined}
          footer={
            !isInlineAdd ? (
              <TablePagination
                hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                onNextPage={onNextPage}
                hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                onPreviousPage={onPreviousPage}
                settings={settings}
                onUpdateListSettings={onUpdateListSettings}
              />
            ) : undefined
          }
        >
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

  const valuesContent =
    values === undefined ? (
      <Skeleton />
    ) : (
      <Box display="flex" flexDirection="column" gap={4}>
        {showSearch ? (
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
        ) : null}
        {!showValuesTable && !searchQuery ? (
          <Placeholder>
            <FormattedMessage
              id="dAst+b"
              defaultMessage="No values found"
              description="attribute values list: no attribute values found"
            />
          </Placeholder>
        ) : values?.length === 0 && searchQuery ? (
          <Placeholder>
            <FormattedMessage
              id="oegjWf"
              defaultMessage="No values match your search"
              description="attribute values list: no search results"
            />
          </Placeholder>
        ) : (
          valuesTable
        )}
      </Box>
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
        {valuesContent}
      </Box>
    );
  }

  return (
    <DashboardCard data-test-id="attribute-values-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "J3uE0t",
            defaultMessage: "Attribute Values",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {!isInlineAdd ? (
            <Button
              disabled={disabled}
              variant="secondary"
              onClick={onValueAdd}
              data-test-id="assign-value-button"
            >
              <FormattedMessage
                id="+iVKR1"
                defaultMessage="Assign value"
                description="assign attribute value button"
              />
            </Button>
          ) : null}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>{valuesContent}</DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeValues.displayName = "AttributeValues";
export { AttributeValues };
