import {
  Button,
  Card,
  IconButton,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow
} from "@saleor/components/SortableTable";
import TablePagination from "@saleor/components/TablePagination";
import { AttributeValueListFragment_edges_node } from "@saleor/fragments/types/AttributeValueListFragment";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import { ListProps, ReorderAction } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeValuesProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">> {
  disabled: boolean;
  values: AttributeValueListFragment_edges_node[];
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    columnAdmin: {
      width: 300
    },
    columnDrag: {
      width: 48 + theme.spacing(1.5)
    },
    columnStore: {
      width: "auto"
    },
    dragIcon: {
      cursor: "grab"
    },
    iconCell: {
      "&:last-child": {
        paddingRight: theme.spacing()
      },
      width: 80
    },
    link: {
      cursor: "pointer"
    }
  }),
  { name: "AttributeValues" }
);

const numberOfColumns = 4;

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
  onPreviousPage
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Attribute Values",
          description: "section header"
        })}
        toolbar={
          <Button color="primary" variant="text" onClick={onValueAdd}>
            <FormattedMessage
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
            <TableCell className={classes.columnAdmin}>
              <FormattedMessage
                defaultMessage="Admin"
                description="attribute values list: slug column header"
              />
            </TableCell>
            <TableCell className={classes.columnStore}>
              <FormattedMessage
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
              <SortableTableRow
                className={!!value ? classes.link : undefined}
                hover={!!value}
                onClick={!!value ? () => onValueUpdate(value.id) : undefined}
                key={maybe(() => value.id)}
                index={valueIndex || 0}
              >
                <TableCell className={classes.columnAdmin}>
                  {maybe(() => value.slug) ? value.slug : <Skeleton />}
                </TableCell>
                <TableCell className={classes.columnStore}>
                  {maybe(() => value.name) ? value.name : <Skeleton />}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton
                    disabled={disabled}
                    onClick={stopPropagation(() => onValueDelete(value.id))}
                  >
                    <DeleteIcon color="primary" />
                  </IconButton>
                </TableCell>
              </SortableTableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={2}>
                  <FormattedMessage
                    defaultMessage="No values found"
                    description="No attribute values found"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
AttributeValues.displayName = "AttributeValues";
export default AttributeValues;
