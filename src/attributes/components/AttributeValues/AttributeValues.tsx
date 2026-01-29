import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TablePagination } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  AttributeValueListFragment,
} from "@dashboard/graphql";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { ListProps, PaginateListProps, RelayToFlat, ReorderAction } from "@dashboard/types";
import { TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import { Search, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      paddingX={3}
      paddingY={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      backgroundColor="default1"
    >
      <Box display="flex" alignItems="center" flexShrink="0">
        <Search size={16} color="var(--mu-colors-text-default2)" />
      </Box>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        data-test-id="attribute-value-search-input"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: "14px",
          color: "var(--mu-colors-text-default1)",
          minWidth: 0,
        }}
      />
      {value && (
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          cursor="pointer"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          data-test-id="attribute-value-search-clear"
        >
          <X size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      )}
    </Box>
  );
};

function filterAttributeValues(
  values: RelayToFlat<AttributeValueListFragment> | undefined,
  searchQuery: string,
): RelayToFlat<AttributeValueListFragment> | undefined {
  if (!values || !searchQuery.trim()) {
    return values;
  }

  const query = searchQuery.toLowerCase().trim();

  return values.filter(
    value => value.slug?.toLowerCase().includes(query) || value.name?.toLowerCase().includes(query),
  );
}

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
}: AttributeValuesProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredValues = useMemo(
    () => filterAttributeValues(values, searchQuery),
    [values, searchQuery],
  );

  const SEARCH_THRESHOLD = 5;
  const showSearch = values && values.length > SEARCH_THRESHOLD;

  // Only apply filtering when search is visible
  const displayedValues = showSearch ? filteredValues : values;
  const hasDisplayedValues = displayedValues && displayedValues.length > 0;

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
        ) : values.length === 0 ? (
          <Placeholder>
            <FormattedMessage
              id="dAst+b"
              defaultMessage="No values found"
              description="attribute values list: no attribute values found"
            />
          </Placeholder>
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            {showSearch && (
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={intl.formatMessage({
                  id: "9seX5T",
                  defaultMessage: "Search attribute values...",
                  description: "attribute values search placeholder",
                })}
              />
            )}
            {!hasDisplayedValues && searchQuery ? (
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
                <SortableTableBody onSortEnd={onValueReorder}>
                  {renderCollection(displayedValues, (value, valueIndex) => (
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
