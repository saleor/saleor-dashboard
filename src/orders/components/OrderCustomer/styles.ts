import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    sectionHeader: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
    },
    sectionHeaderTitle: {
      flex: 1,
      fontWeight: 600 as 600,
      lineHeight: 1,
      textTransform: "uppercase",
    },
    sectionHeaderToolbar: {
      marginRight: theme.spacing(-2),
    },
    userEmail: {
      fontWeight: 600 as 600,
      marginBottom: theme.spacing(1),
    },
  }),
  { name: "OrderCustomer" },
);

export const useAddressTextErrorStyles = makeStyles(
  theme => ({
    textError: {
      color: theme.palette.error.main,
    },
  }),
  { name: "AddrssTextError" },
);
