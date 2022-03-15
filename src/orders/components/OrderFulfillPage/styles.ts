import { CSSProperties } from "@material-ui/styles";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      colName: {
        width: 250
      },
      colQuantity: {
        textAlign: "right",
        width: 210
      },
      colQuantityHeader: {
        textAlign: "right"
      },
      colStock: {
        textAlign: "right",
        width: 180
      },
      colSku: {
        textAlign: "right",
        textOverflow: "ellipsis",
        width: 150
      },
      error: {
        color: theme.palette.error.main
      },
      quantityInnerInput: {
        ...inputPadding
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap"
      },
      table: {
        "&&": {
          tableLayout: "fixed"
        }
      },
      shipmentInformationCard: {
        padding: theme.spacing(3),
        alignSelf: "start",
        display: "grid",
        gridRowGap: theme.spacing(1)
      },
      supportHeader: {
        textTransform: "uppercase",
        color: theme.palette.saleor.main[3],
        fontWeight: 500,
        letterSpacing: "0.1em",
        fontSize: "12px",
        lineHeight: "160%",
        marginBottom: theme.spacing(2)
      },
      warehouseLabel: {
        marginBottom: theme.spacing(4)
      },
      warningIcon: {
        color: theme.palette.saleor.warning.mid,
        marginRight: theme.spacing(2)
      },
      warning: {
        color: theme.palette.warning.main,
        borderColor: theme.palette.warning.main + " !important"
      }
    };
  },
  { name: "OrderFulfillPage" }
);
