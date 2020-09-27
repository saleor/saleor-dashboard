import {Table, TableBody, TableCell, TableFooter, TableHead, TableRow} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    capitalize: {
      textTransform: "capitalize"
    },
    card: {
      overflow: "visible"
    },
    cardSubtitle: {
      fontSize: "1rem",
      marginBottom: theme.spacing(0.5)
    },
    label: {
      marginBottom: theme.spacing(0.5)
    }
  }),
  { name: "ProductOrganization" }
);

interface ProductBundleContentProps {
  content: any[];
}

const ProductBundleContent: React.FC<ProductBundleContentProps> = props => {
  const {
    content,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  if (content == null) {
    return null;
  }

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Zawartość paczki",
          description: "section header"
        })}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jakość</TableCell>
              <TableCell align="right">Ilość szt.</TableCell>
              <TableCell align="right">Waga [kg]</TableCell>
              <TableCell align="right">Cena/kg</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((row) => (
              <TableRow key={row[0]}>
                <TableCell component="th" scope="row" className={classes.capitalize}>
                  {row[0]}
                </TableCell>
                <TableCell align="right">{row[1] ? row[1] : "-"}</TableCell>
                <TableCell align="right">{row[2] ? intl.formatNumber(row[2], {minimumFractionDigits: 2}) : "-"}</TableCell>
                <TableCell align="right">{row[3] ? intl.formatNumber(row[3], {minimumFractionDigits: 2}) : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell align="right">{content.reduce((a, b) => a + b[1], 0)}</TableCell>
              <TableCell align="right">{intl.formatNumber(content.reduce((a, b) => a + b[2], 0), {minimumFractionDigits: 2})}</TableCell>
              <TableCell align="right">{content.every(x => x[3] != null) ?
                intl.formatNumber(content.reduce((a, b) => a + (b[2]*b[3]), 0), {minimumFractionDigits: 2})
                : "-"}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};
ProductBundleContent.displayName = "ProductBundleContent";
export default ProductBundleContent;
