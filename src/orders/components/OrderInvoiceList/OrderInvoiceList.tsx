import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Date from "@saleor/components/Date";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { InvoiceFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    card: {
      overflow: "hidden",
    },
    cardContentTable: {
      "&:last-child": {
        padding: 0,
      },
      padding: 0,
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

  const generatedInvoices = invoices?.filter(
    invoice => invoice.status === "SUCCESS",
  );

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          id: "Gzg8hy",
          defaultMessage: "Invoices",
          description: "section header",
        })}
        toolbar={
          onInvoiceGenerate && (
            <Button onClick={onInvoiceGenerate}>
              <FormattedMessage
                id="e0RKe+"
                defaultMessage="Generate"
                description="generate invoice button"
              />
            </Button>
          )
        }
      />
      <CardContent
        className={classNames({
          [classes.cardContentTable]: generatedInvoices?.length,
        })}
      >
        {!generatedInvoices ? (
          <Skeleton />
        ) : !generatedInvoices?.length ? (
          <Typography color="textSecondary">
            <FormattedMessage
              id="hPB89Y"
              defaultMessage="No invoices to be shown"
            />
          </Typography>
        ) : (
          <ResponsiveTable className={classes.invoicesTable}>
            <TableBody className={classes.invoicesTableBody}>
              {generatedInvoices.map(invoice => (
                <TableRow key={invoice.id} hover={!!invoice}>
                  <TableCell
                    className={
                      onInvoiceClick
                        ? classes.colNumberClickable
                        : classes.colNumber
                    }
                    onClick={() => onInvoiceClick(invoice.id)}
                  >
                    <FormattedMessage
                      id="m6IBe5"
                      defaultMessage="Invoice"
                      description="invoice number prefix"
                    />{" "}
                    {invoice.number}
                    <Typography variant="caption">
                      <FormattedMessage
                        id="F0AXNs"
                        defaultMessage="created"
                        description="invoice create date prefix"
                      />{" "}
                      <Date date={invoice.createdAt} plain />
                    </Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </CardContent>
    </Card>
  );
};

OrderInvoiceList.displayName = "OrderInvoiceList";
export default OrderInvoiceList;
