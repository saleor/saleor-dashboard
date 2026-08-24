import { Pill } from "@dashboard/components/Pill";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CustomerTypeListUrlSortField, customerTypePath } from "@dashboard/customerTypes/urls";
import { type CustomerTypeFragment } from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import { renderCollection } from "@dashboard/misc";
import { type ListProps, type SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

const useStyles = makeStyles(
  {
    colName: {
      width: "40%",
    },
    colSlug: {
      width: "40%",
    },
    colDefault: {
      width: "20%",
    },
    link: {
      cursor: "pointer",
    },
  },
  { name: "CustomerTypeList" },
);

interface CustomerTypeListProps extends ListProps, SortPage<CustomerTypeListUrlSortField> {
  customerTypes: CustomerTypeFragment[];
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
    toolbar?: React.ReactNode;
  };
}

const numberOfColumns = 3;

export const CustomerTypeList = (props: CustomerTypeListProps) => {
  const { disabled, customerTypes, onSort, sort, search } = props;
  const location = useLocation();
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <ResponsiveTable search={search} footer={<TablePaginationWithContext disabled={disabled} />}>
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            direction={
              sort.sort === CustomerTypeListUrlSortField.name
                ? getArrowDirection(!!sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(CustomerTypeListUrlSortField.name)}
            className={classes.colName}
          >
            <FormattedMessage
              id="u+ozTE"
              defaultMessage="Customer type name"
              description="customer type name column"
            />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === CustomerTypeListUrlSortField.slug
                ? getArrowDirection(!!sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(CustomerTypeListUrlSortField.slug)}
            className={classes.colSlug}
          >
            <FormattedMessage
              id="bp7Fo7"
              defaultMessage="Slug"
              description="customer type slug column"
            />
          </TableCellHeader>
          <TableCellHeader className={classes.colDefault}>
            <FormattedMessage
              id="6SiomK"
              defaultMessage="Default"
              description="customer type default column"
            />
          </TableCellHeader>
        </TableRowLink>
      </TableHead>
      <TableBody data-test-id="customer-types-list">
        {renderCollection(
          customerTypes,
          customerType => (
            <TableRowLink
              className={customerType ? classes.link : undefined}
              hover={!!customerType}
              key={customerType ? customerType.id : "skeleton"}
              href={
                customerType
                  ? {
                      pathname: customerTypePath(encodeURIComponent(customerType.id)),
                      state: getPrevLocationState(location),
                    }
                  : undefined
              }
              data-test-id={"id-" + customerType?.id}
            >
              <TableCell className={classes.colName}>
                {customerType ? <span data-test-id="name">{customerType.name}</span> : <Skeleton />}
              </TableCell>
              <TableCell className={classes.colSlug}>
                {customerType ? <span data-test-id="slug">{customerType.slug}</span> : <Skeleton />}
              </TableCell>
              <TableCell className={classes.colDefault}>
                {customerType ? (
                  customerType.isDefault ? (
                    <Pill
                      data-test-id="default-pill"
                      label={intl.formatMessage({
                        id: "tCPJxK",
                        defaultMessage: "Default",
                        description: "default customer type list badge",
                      })}
                      color="success"
                    />
                  ) : null
                ) : (
                  <Skeleton />
                )}
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="YSM9lU" defaultMessage="No customer types found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

CustomerTypeList.displayName = "CustomerTypeList";
