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
    selectableCard: {
      "&:hover": {
        cursor: "pointer",
        borderColor: theme.palette.primary.main
      }
    },
    selectedLabel: {
      fontSize: "1.4rem",
      lineHeight: "1.75",
      fontWeight: 600,
      textTransform: "uppercase"
    },
    editIcon: {
      color: theme.palette.grey[600],
      "&:hover": {
        color: theme.palette.primary.main,
        cursor: "pointer"
      }
    }
  }),
  { name: "CustomerAddressChoiceCard" }
);
