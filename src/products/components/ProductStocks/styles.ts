import { ICONBUTTON_SIZE, makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colAction: {
      padding: 0,
      width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(1)})`,
    },
    colName: {},
    colQuantity: {
      textAlign: "right",
      width: 150,
    },
    colSoldUnits: {
      textAlign: "right",
      width: 150,
    },
    colThreshold: {
      textAlign: "right",
      width: 180,
    },
    editWarehouses: {
      marginRight: theme.spacing(-1),
    },
    input: {
      padding: theme.spacing(1.5),
      textAlign: "right",
    },
    menuItem: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(2),
      },
    },
    noWarehouseInfo: {
      marginTop: theme.spacing(),
    },
    paper: {
      padding: theme.spacing(2),
    },
    popper: {
      marginTop: theme.spacing(1),
      zIndex: 2,
      maxHeight: 400,
      overflow: "scroll",
    },
    quantityContainer: {
      paddingTop: theme.spacing(),
    },
    quantityHeader: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
    },
    skuInputContainer: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    dateTimeInputs: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    preorderInfo: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: "block",
    },
    caption: {
      fontSize: 14,
    },
    thresholdRow: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "3fr 1fr",
      marginTop: theme.spacing(1),
    },
    thresholdInput: {
      maxWidth: 400,
    },
    addRow: {
      "&:hover": {
        cursor: "pointer",
        "& $actionableText": {
          color: theme.palette.primary.main,
        },
      },
    },
    actionableText: {},
    preorderItemsLeftCount: {
      fontSize: 14,
      paddingTop: theme.spacing(2),
      textAlign: "center",
    },
    preorderLimitInfo: {
      marginTop: theme.spacing(3),
    },
    preview: {
      marginLeft: theme.spacing(1),
    },
  }),
  {
    name: "ProductStocks",
  },
);
