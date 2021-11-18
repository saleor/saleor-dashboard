import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    card: {
      padding: "1px"
    },
    cardSelected: {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
      padding: "0"
    },
    cardContent: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start"
    },
    selectedLabel: {
      fontSize: "1.4rem",
      lineHeight: "1.75",
      fontWeight: 600,
      textTransform: "uppercase"
    }
  }),
  { name: "CustomerAddressChoiceCard" }
);
