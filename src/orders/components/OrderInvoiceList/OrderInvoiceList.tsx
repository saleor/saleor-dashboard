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
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  () => ({
    cardContent: {
      "&:last-child": {
        padding: 0
      },
      padding: 0
    },
    colAction: { width: "auto" },
    colNumber: { width: "100%" }
  }),
  { name: "OrderInvoiceList" }
);

const OrderInvoiceList: React.FC = props => {
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Invoices",
          description: "section header"
        })}
      />
      <CardContent className={classes.cardContent}>
        <ResponsiveTable>
          <TableHead>
            <TableCellHeader className={classes.colNumber}>
              <FormattedMessage
                defaultMessage="Invoice no"
                description="invoice number"
              />
            </TableCellHeader>
            <TableCellHeader className={classes.colAction}>
              <FormattedMessage
                defaultMessage="Action"
                description="action for invoice"
              />
            </TableCellHeader>
          </TableHead>
          <TableBody>
            {/*
             ** TODO: populate with real invoice data
             */}
            <TableRow>
              <TableCell className={classes.colNumber}>
                Invoice 12/01/242BF
                <Typography variant="caption">created 20/12/2019</Typography>
              </TableCell>
              <TableCell className={classes.colAction}>
                <Button color="primary">
                  <FormattedMessage {...buttonMessages.send} />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.colNumber}>
                Invoice 12/01/242BF
                <Typography variant="caption">created 20/12/2019</Typography>
              </TableCell>
              <TableCell className={classes.colAction}>
                <Button color="primary">
                  <FormattedMessage {...buttonMessages.send} />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};

OrderInvoiceList.displayName = "OrderInvoiceList";
export default OrderInvoiceList;
