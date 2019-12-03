import { Omit } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TablePagination from "@saleor/components/TablePagination";
import Skeleton from "@saleor/components/Skeleton";
import { ListProps } from "../../../types";
import { maybe, renderCollection } from "../../../misc";

export interface TranslatableEntity {
  id: string;
  name: string;
  completion: {
    current: number;
    max: number;
  };
}

export interface TranslationsEntitiesListProps
  extends Omit<ListProps, "onRowClick"> {
  entities: TranslatableEntity[];
  onRowClick: (code: string) => void;
}

const useStyles = makeStyles(
  {
    tableRow: {
      cursor: "pointer"
    },
    textRight: {
      textAlign: "right"
    },
    wideColumn: {
      width: "80%"
    }
  },
  { name: "TranslationsEntitiesList" }
);
const TranslationsEntitiesList: React.FC<
  TranslationsEntitiesListProps
> = props => {
  const {
    disabled,
    entities,
    onNextPage,
    onPreviousPage,
    onRowClick,
    pageInfo
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCell className={classes.wideColumn}>
            <FormattedMessage
              defaultMessage="Name"
              description="entity (product, collection, shipping method) name"
            />
          </TableCell>
          <TableCell className={classes.textRight}>
            <FormattedMessage defaultMessage="Completed Translations" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={2}
            hasNextPage={
              pageInfo && !disabled ? pageInfo.hasNextPage : undefined
            }
            onNextPage={onNextPage}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : undefined
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          entities,
          entity => (
            <TableRow
              className={classNames({
                [classes.tableRow]: !!entity
              })}
              hover={!!entity}
              onClick={entity ? () => onRowClick(entity.id) : undefined}
              key={entity ? entity.id : "skeleton"}
            >
              <TableCell>
                {maybe<React.ReactNode>(() => entity.name, <Skeleton />)}
              </TableCell>
              <TableCell className={classes.textRight}>
                {maybe<React.ReactNode>(
                  () =>
                    intl.formatMessage(
                      {
                        defaultMessage: "{current} of {max}",
                        description: "translation progress"
                      },
                      entity.completion
                    ),
                  <Skeleton />
                )}
              </TableCell>
            </TableRow>
          ),
          () => (
            <TableRow>
              <TableCell colSpan={2}>
                <FormattedMessage defaultMessage="No translatable entities found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
TranslationsEntitiesList.displayName = "TranslationsEntitiesList";
export default TranslationsEntitiesList;
