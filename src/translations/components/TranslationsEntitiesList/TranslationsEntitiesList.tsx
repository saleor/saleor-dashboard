import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListProps } from "../../../types";

export interface TranslatableEntity {
  id: string;
  name: string;
  completion: {
    current: number;
    max: number;
  };
}

export interface TranslationsEntitiesListProps extends ListProps {
  entities: TranslatableEntity[];
  getRowHref: (id: string) => string;
}

const useStyles = makeStyles(
  {
    tableRow: {
      cursor: "pointer",
    },
    textRight: {
      textAlign: "right",
    },
    wideColumn: {
      width: "80%",
    },
  },
  { name: "TranslationsEntitiesList" },
);
const TranslationsEntitiesList: React.FC<TranslationsEntitiesListProps> = props => {
  const { disabled, entities, getRowHref } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCell className={classes.wideColumn}>
            <FormattedMessage
              id="X6PF8z"
              defaultMessage="Name"
              description="entity (product, collection, shipping method) name"
            />
          </TableCell>
          <TableCell className={classes.textRight}>
            <FormattedMessage
              id="LWmYSU"
              defaultMessage="Completed Translations"
            />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext colSpan={2} disabled={disabled} />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          entities,
          entity => (
            <TableRowLink
              className={classNames({
                [classes.tableRow]: !!entity,
              })}
              hover={!!entity}
              href={entity && getRowHref(entity.id)}
              key={entity ? entity.id : "skeleton"}
            >
              <TableCell>{entity?.name || <Skeleton />}</TableCell>
              <TableCell className={classes.textRight}>
                {!!entity?.completion &&
                  maybe<React.ReactNode>(
                    () =>
                      intl.formatMessage(
                        {
                          id: "ikRuLs",
                          defaultMessage: "{current} of {max}",
                          description: "translation progress",
                        },
                        entity.completion,
                      ),
                    <Skeleton />,
                  )}
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRow>
              <TableCell colSpan={2}>
                <FormattedMessage
                  id="vcwrgW"
                  defaultMessage="No translatable entities found"
                />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
TranslationsEntitiesList.displayName = "TranslationsEntitiesList";
export default TranslationsEntitiesList;
