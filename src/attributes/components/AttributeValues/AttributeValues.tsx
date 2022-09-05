import {
  Card,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@saleor/components/SortableTable";
import TablePagination from "@saleor/components/TablePagination";
import {
  AttributeInputTypeEnum,
  AttributeValueFragment,
  AttributeValueListFragment,
} from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import {
  ListProps,
  PaginateListProps,
  RelayToFlat,
  ReorderAction,
} from "@saleor/types";
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
          <TableRow>
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
          </TableRow>
        </TableHead>
        <TableFooter>
          <TableRow>
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
          </TableRow>
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
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="g5zIpS"
                    defaultMessage="No values found"
                    description="No attribute values found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
AttributeValues.displayName = "AttributeValues";
export default AttributeValues;
