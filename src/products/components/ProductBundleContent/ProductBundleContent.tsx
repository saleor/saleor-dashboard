import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import ConfirmButton from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { buttonMessages, commonMessages } from "@saleor/intl";
import { useProductBulkClearWarehouseLocation } from "@saleor/products/mutations";
import {
  productUrl,
  ProductUrlDialog,
  ProductUrlQueryParams
} from "@saleor/products/urls";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    button: {
      "&:hover": {
        backgroundColor: theme.palette.primary.dark
      },
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      marginLeft: theme.spacing(1)
    },
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
  id: string;
  params: ProductUrlQueryParams;
  on_modal_click: any;
}

const ProductBundleContent: React.FC<ProductBundleContentProps> = props => {
  const navigate = useNavigator();

  const { content, id, params, on_modal_click } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  if (content == null) {
    return null;
  }

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);

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
            {content.map(row => (
              <TableRow key={row[0]}>
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.capitalize}
                >
                  {row[0]}
                </TableCell>
                <TableCell align="right">{row[1] ? row[1] : "-"}</TableCell>
                <TableCell align="right">
                  {row[2]
                    ? intl.formatNumber(row[2], { minimumFractionDigits: 2 })
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  {row[3]
                    ? intl.formatNumber(row[3], { minimumFractionDigits: 2 })
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell align="right">
                {content.reduce((a, b) => a + b[1], 0)}
              </TableCell>
              <TableCell align="right">
                {intl.formatNumber(
                  content.reduce((a, b) => a + b[2], 0),
                  { minimumFractionDigits: 2 }
                )}
              </TableCell>
              <TableCell align="right">
                {content.every(x => x[3] != null)
                  ? intl.formatNumber(
                      content.reduce((a, b) => a + b[2] * b[3], 0),
                      { minimumFractionDigits: 2 }
                    )
                  : "-"}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <Button
        variant="contained"
        onClick={() => openModal("submit")}
        data-test="button-bar-delete"
        className={classes.button}
      >
        Zatwierdź
      </Button>

      <Dialog
        open={params.action === "submit"}
        onClose={closeModal}
        title={intl.formatMessage({
          defaultMessage: "Publish products",
          description: "dialog header"
        })}
      >
        <DialogContent>
          <DialogContentText>
            <FormattedMessage
              defaultMessage="Zatwierdzenie produktu wyczyści lokacje magazynowe produktów Mega Paki. Czy na pewno chcesz kontynuuować?"
              description="dialog content"
            />
          </DialogContentText>
          <FormSpacer />
          <FormSpacer />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>
            <FormattedMessage {...buttonMessages.back} />
          </Button>
          <ConfirmButton
            color="primary"
            variant="contained"
            onClick={() => on_modal_click()}
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
ProductBundleContent.displayName = "ProductBundleContent";
export default ProductBundleContent;
