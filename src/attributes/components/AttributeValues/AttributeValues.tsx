import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@dashboard/components/SortableTable";
import TablePagination from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  AttributeValueListFragment,
} from "@dashboard/graphql";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import {
  ListProps,
  PaginateListProps,
  RelayToFlat,
  ReorderAction,
} from "@dashboard/types";
import { Card, TableCell, TableFooter, TableHead } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeValuesProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    PaginateListProps {
  disabled: boolean;
  values: RelayToFlat<AttributeValueListFragment>;
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
      width: 84,
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

const getSwatchCellStyle = (value: AttributeValueFragment) => {
  if (!value) {
    return;
  }
  return value.file
    ? { backgroundImage: `url(${value.file.url})` }
    : { backgroundColor: value.value };
};

const AttributeValues: React.FC<AttributeValuesProps> = ({
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
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const numberOfColumns = isSwatch ? 5 : 4;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "J3uE0t",
          defaultMessage: "Attribute Values",
          description: "section header",
        })}
        toolbar={
          <Button
            disabled={disabled}
            variant="tertiary"
            onClick={onValueAdd}
            data-test-id="assign-value-button"
          >
            <FormattedMessage
              id="+iVKR1"
              defaultMessage="Assign value"
              description="assign attribute value button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
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
        <TableFooter>
          <TableRowLink>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </TableRowLink>
        </TableFooter>
        <SortableTableBody onSortEnd={onValueReorder}>
          {renderCollection(
            values,
            (value, valueIndex) => (
              <SortableTableRow<"row">
                className={!!value ? classes.link : undefined}
                hover={!!value}
                onClick={!!value ? () => onValueUpdate(value.id) : undefined}
                key={value?.id}
                index={valueIndex || 0}
              >
                {isSwatch && (
                  <TableCell className={classes.columnSwatch}>
                    <div
                      data-test-id="swatch-image"
                      className={classes.swatch}
                      style={getSwatchCellStyle(value)}
                    />
                  </TableCell>
                )}
                <TableCell className={classes.columnAdmin}>
                  {value?.slug ?? <Skeleton />}
                </TableCell>
                <TableCell className={classes.columnStore}>
                  {value?.name ?? <Skeleton />}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton
                    variant="secondary"
                    disabled={disabled}
                    onClick={stopPropagation(() => onValueDelete(value.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </SortableTableRow>
            ),
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="g5zIpS"
                    defaultMessage="No values found"
                    description="No attribute values found"
                  />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
AttributeValues.displayName = "AttributeValues";
export default AttributeValues;
