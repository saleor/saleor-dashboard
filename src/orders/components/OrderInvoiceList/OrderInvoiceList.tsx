// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import Date from "@dashboard/components/Date";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { InvoiceFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { TableBody, TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    card: {
      overflow: "hidden",
    },
    colAction: {
      button: {
        padding: "0",
      },
      padding: "0 0.5rem",
      width: "auto",
    },
    colNumber: { width: "100%" },
    colNumberClickable: {
      cursor: "pointer",
      width: "100%",
    },
    invoicesTable: {
      display: "flex",
    },
    invoicesTableBody: {
      width: "100%",
    },
  }),
  { name: "OrderInvoiceList" },
);

export interface OrderInvoiceListProps {
  invoices: InvoiceFragment[];
  onInvoiceGenerate: () => void;
  onInvoiceClick: (invoiceId: string) => void;
  onInvoiceSend: (invoiceId: string) => void;
}

const OrderInvoiceList: React.FC<OrderInvoiceListProps> = props => {
  const { invoices, onInvoiceGenerate, onInvoiceClick, onInvoiceSend } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const generatedInvoices = invoices?.filter(invoice => invoice.status === "SUCCESS");

  return (
    <DashboardCard className={classes.card}>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "Gzg8hy",
          defaultMessage: "Invoices",
          description: "section header",
        })}
      />
      <DashboardCard.Toolbar>
        {onInvoiceGenerate && (
          <Button onClick={onInvoiceGenerate} className={sprinkles({ marginRight: 0.5 })}>
            <FormattedMessage
              id="e0RKe+"
              defaultMessage="Generate"
              description="generate invoice button"
            />
          </Button>
        )}
      </DashboardCard.Toolbar>
      <DashboardCard.Content>
        {!generatedInvoices ? (
          <Skeleton />
        ) : !generatedInvoices?.length ? (
          <Text color="default2">
            <FormattedMessage id="hPB89Y" defaultMessage="No invoices to be shown" />
          </Text>
        ) : (
          <ResponsiveTable className={classes.invoicesTable}>
            <TableBody className={classes.invoicesTableBody}>
              {generatedInvoices.map(invoice => (
                <TableRowLink key={invoice.id} hover={!!invoice}>
                  <TableCell
                    className={onInvoiceClick ? classes.colNumberClickable : classes.colNumber}
                    onClick={() => onInvoiceClick(invoice.id)}
                  >
                    <FormattedMessage
                      id="m6IBe5"
                      defaultMessage="Invoice"
                      description="invoice number prefix"
                    />{" "}
                    {invoice.number}
                    <Text size={2} fontWeight="light">
                      <FormattedMessage
                        id="F0AXNs"
                        defaultMessage="created"
                        description="invoice create date prefix"
                      />{" "}
                      <Date date={invoice.createdAt} plain />
                    </Text>
                  </TableCell>
                  {onInvoiceSend && (
                    <TableCell
                      className={classes.colAction}
                      onClick={() => onInvoiceSend(invoice.id)}
                    >
                      <Button>
                        <FormattedMessage {...buttonMessages.send} />
                      </Button>
                    </TableCell>
                  )}
                </TableRowLink>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderInvoiceList.displayName = "OrderInvoiceList";
export default OrderInvoiceList;
