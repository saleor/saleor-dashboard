import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { TableBody, TableCell, TableFooter, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import clsx from "clsx";
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
const TranslationsEntitiesList = (props: TranslationsEntitiesListProps) => {
  const { disabled, entities, getRowHref } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRowLink>
          <TableCell className={classes.wideColumn}>
            <FormattedMessage
              id="X6PF8z"
              defaultMessage="Name"
              description="entity (product, collection, shipping method) name"
            />
          </TableCell>
          <TableCell className={classes.textRight}>
            <FormattedMessage id="LWmYSU" defaultMessage="Completed Translations" />
          </TableCell>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext colSpan={2} disabled={disabled} />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          entities,
          entity => (
            <TableRowLink
              className={clsx({
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
            <TableRowLink>
              <TableCell colSpan={2}>
                <FormattedMessage id="vcwrgW" defaultMessage="No translatable entities found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

TranslationsEntitiesList.displayName = "TranslationsEntitiesList";
export default TranslationsEntitiesList;
