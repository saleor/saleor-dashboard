import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { ListProps } from "@saleor/types";
import TablePagination from "@saleor/components/TablePagination";
import { renderCollection, maybe, stopPropagation } from "@saleor/misc";
import noIcon from "@assets/images/photo-icon.svg";

export interface ExtensionListProps extends ListProps {
  extensions: Array<Record<"id" | "author" | "icon" | "name" | "url", string>>;
}

const useStyles = makeStyles(
  theme => ({
    colAbout: {
      paddingRight: 0,
      textAlign: "right",
      width: 150
    },
    colIcon: {
      "& img": {
        height: 48,
        width: 48
      },
      paddingBottom: theme.spacing(0.5),
      width: 48
    },
    colName: {
      color: theme.palette.primary.main,
      fontWeight: 600,
      paddingLeft: 0
    },
    colRemove: {
      paddingLeft: theme.spacing(),
      paddingRight: theme.spacing(),
      width: 50
    },
    tableRow: {
      "&:first-child": {
        "& td": {
          paddingTop: theme.spacing(3)
        }
      },
      cursor: "pointer"
    }
  }),
  { name: "ExtensionList" }
);

const numberOfColumns = 4;

const ExtensionList: React.FC<ExtensionListProps> = ({
  disabled,
  extensions,
  onNextPage,
  onPreviousPage,
  onRowClick,
  pageInfo
}) => {
  const classes = useStyles({});

  return (
    <Card>
      <ResponsiveTable>
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
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            extensions,
            extension => (
              <TableRow
                className={!!extension ? classes.tableRow : undefined}
                hover={!!extension}
                key={extension ? extension.id : "skeleton"}
                onClick={extension ? onRowClick(extension.id) : undefined}
              >
                <TableCell className={classes.colIcon}>
                  <img src={maybe(() => extension.icon, noIcon)} />
                </TableCell>
                <TableCell className={classes.colName}>
                  {maybe<React.ReactNode>(() => extension.name, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colAbout}>
                  <Button
                    color="primary"
                    onClick={stopPropagation(() => undefined)}
                  >
                    <FormattedMessage
                      defaultMessage="About"
                      description="about extension, button"
                    />
                  </Button>
                </TableCell>
                <TableCell className={classes.colRemove}>
                  <IconButton
                    color="primary"
                    onClick={stopPropagation(() => undefined)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage defaultMessage="No sales found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

ExtensionList.displayName = "ExtensionList";
export default ExtensionList;
