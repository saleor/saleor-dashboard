import { rippleAttributeValuesSearch } from "@dashboard/attributes/ripples/attributeValuesSearch";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { SearchInput } from "@dashboard/components/SearchInput/SearchInput";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TablePagination } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  AttributeValueListFragment,
} from "@dashboard/graphql";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { ListProps, PaginateListProps, RelayToFlat, ReorderAction } from "@dashboard/types";
import { TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

interface AttributeValuesProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    PaginateListProps {
  disabled: boolean;
  values?: RelayToFlat<AttributeValueListFragment>;
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
  inputType: AttributeInputTypeEnum;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
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
    dragIcon: {
      cursor: "grab",
    },
    iconCell: {
      width: 48,
    },
    link: {
      cursor: "pointer",
    },
    swatch: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  }),
  { name: "AttributeValues" },
);
const getSwatchCellStyle = (value?: AttributeValueFragment | undefined) => {
  if (!value) {
    return;
  }

  return value.file
    ? { backgroundImage: `url(${value.file.url})` }
    : { backgroundColor: value.value ?? undefined };
};

const AttributeValues = ({
  disabled,
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
}: AttributeValuesProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;

  // Show search when callback is provided (controlled by parent)
  const showSearch = Boolean(onSearchChange);

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
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {values === undefined ? (
          <Skeleton />
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Search input - always visible when search is enabled */}
            {showSearch && (
              <Box position="relative">
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
                <Box position="absolute" __top="-4px" __right="-4px">
                  <Ripple model={rippleAttributeValuesSearch} />
                </Box>
              </Box>
            )}
            {/* No values at all (not searching) */}
            {values.length === 0 && !searchQuery ? (
              <Placeholder>
                <FormattedMessage
                  id="dAst+b"
                  defaultMessage="No values found"
                  description="attribute values list: no attribute values found"
                />
              </Placeholder>
            ) : /* Search returned no results */
            values.length === 0 && searchQuery ? (
              <Placeholder>
                <FormattedMessage
                  id="oegjWf"
                  defaultMessage="No values match your search"
                  description="attribute values list: no search results"
                />
              </Placeholder>
            ) : (
              <ResponsiveTable
                footer={
                  <TablePagination
                    hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                    onNextPage={onNextPage}
                    hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                    onPreviousPage={onPreviousPage}
                    settings={settings}
                    onUpdateListSettings={onUpdateListSettings}
                  />
                }
              >
                <TableHead>
                  <TableRowLink>
                    <TableCell className={classes.columnDrag} />
                    {isSwatch && (
                      <TableCell className={classes.columnSwatch}>
                        <FormattedMessage
                          id="NUevU9"
                          defaultMessage="Swatch"
                          description="attribute values list: slug column header"
                        />
                      </TableCell>
                    )}
                    <TableCell className={classes.columnAdmin}>
                      <FormattedMessage
                        id="3psvRS"
                        defaultMessage="Admin"
                        description="attribute values list: slug column header"
                      />
                    </TableCell>
                    <TableCell className={classes.columnStore}>
                      <FormattedMessage
                        id="H60H6L"
                        defaultMessage="Default Store View"
                        description="attribute values list: name column header"
                      />
                    </TableCell>
                    <TableCell className={classes.iconCell} />
                  </TableRowLink>
                </TableHead>
                <SortableTableBody onSortEnd={onValueReorder} disabled={!!searchQuery}>
                  {renderCollection(values, (value, valueIndex) => (
                    <SortableTableRow<"row">
                      data-test-id="attributes-rows"
                      className={value ? classes.link : undefined}
                      hover={!!value}
                      onClick={value ? () => onValueUpdate(value.id) : undefined}
                      key={value?.id}
                      index={valueIndex || 0}
                    >
                      {isSwatch && (
                        <TableCell className={classes.columnSwatch}>
                          {value?.file ? (
                            <Box
                              as="img"
                              objectFit="cover"
                              alt=""
                              src={value.file.url}
                              __width={32}
                              __height={32}
                              data-test-id="swatch-image"
                            />
                          ) : (
                            <div
                              data-test-id="swatch-image"
                              className={classes.swatch}
                              style={getSwatchCellStyle(value)}
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell
                        className={classes.columnAdmin}
                        data-test-id="attribute-value-name"
                      >
                        {value?.slug ?? <Skeleton />}
                      </TableCell>
                      <TableCell className={classes.columnStore}>
                        {value?.name ?? <Skeleton />}
                      </TableCell>
                      <TableCell className={classes.iconCell}>
                        <Button
                          icon={
                            <Trash2
                              size={iconSize.small}
                              strokeWidth={iconStrokeWidthBySize.small}
                            />
                          }
                          data-test-id="delete-attribute-value-button"
                          variant="secondary"
                          disabled={disabled}
                          onClick={stopPropagation(() => onValueDelete(value?.id ?? ""))}
                        />
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableTableBody>
              </ResponsiveTable>
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeValues.displayName = "AttributeValues";
export { AttributeValues };
