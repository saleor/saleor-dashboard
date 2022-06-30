import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(1, 0),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    root: {
      paddingRight: theme.spacing(1),
    },
  }),
  { name: "WarehousesCard" },
);

export default useStyles;
