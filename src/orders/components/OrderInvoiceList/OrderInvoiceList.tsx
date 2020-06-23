import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Date from "@saleor/components/Date";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { buttonMessages } from "@saleor/intl";
import { InvoiceFragment } from "@saleor/orders/types/InvoiceFragment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    cardContentTable: {
      "&:last-child": {
        padding: 0,
      },
      padding: 0,
    },
    colAction: { paddingRight: "0.5rem", width: "auto" },
    colNumber: { width: "100%" },
    colNumberClickable: {
      cursor: "pointer",
      width: "100%",
    },
  }),
  { name: "OrderInvoiceList" }
);

interface OrderInvoiceListProps {
  invoices: InvoiceFragment[];
  onInvoiceGenerate: () => void;
  onInvoiceClick: (invoice: InvoiceFragment) => void;
  onInvoiceSend: (invoice: InvoiceFragment) => void;
}

const OrderInvoiceList: React.FC<OrderInvoiceListProps> = (props) => {
  const { invoices, onInvoiceGenerate, onInvoiceClick, onInvoiceSend } = props;

  const classes = useStyles(props);

  const intl = useIntl();

  const generatedInvoices = invoices?.filter(
    (invoice) => invoice.status === "SUCCESS"
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Invoices",
          description: "section header",
        })}
        toolbar={
          onInvoiceGenerate && (
            <Button color="primary" onClick={onInvoiceGenerate}>
              <FormattedMessage
                defaultMessage="Generate"
                description="generate invoice button"
              />
            </Button>
          )
        }
      />
      <CardContent
        className={generatedInvoices?.length && classes.cardContentTable}
      >
        {!generatedInvoices ? (
          <Skeleton />
        ) : !generatedInvoices?.length ? (
          <Typography color="textSecondary">
            <FormattedMessage defaultMessage="No invoices to be shown" />
          </Typography>
        ) : (
          <ResponsiveTable>
            <TableHead>
              <TableRow>
                <TableCellHeader className={classes.colNumber}>
                  <FormattedMessage
                    defaultMessage="Invoice no"
                    description="invoice number"
                  />
                </TableCellHeader>
                {onInvoiceSend && (
                  <TableCellHeader className={classes.colAction}>
                    <FormattedMessage
                      defaultMessage="Action"
                      description="action for invoice"
                    />
                  </TableCellHeader>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {generatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell
                    className={
                      onInvoiceClick
                        ? classes.colNumberClickable
                        : classes.colNumber
                    }
                    onClick={() => onInvoiceClick(invoice)}
                  >
                    <FormattedMessage
                      defaultMessage="Invoice"
                      description="invoice number prefix"
                    />{" "}
                    {invoice.number}
                    <Typography variant="caption">
                      <FormattedMessage
                        defaultMessage="created"
                        description="invoice create date prefix"
                      />{" "}
                      <Date date={invoice.createdAt} plain />
                    </Typography>
                  </TableCell>
                  {onInvoiceSend && (
                    <TableCell
                      className={classes.colAction}
                      onClick={() => onInvoiceSend(invoice)}
                    >
                      <Button color="primary">
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
