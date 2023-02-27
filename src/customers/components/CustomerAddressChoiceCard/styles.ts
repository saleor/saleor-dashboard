import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    card: {
      padding: "1px",
      borderColor: theme.palette.saleor.main[5],
      borderStyle: "solid",
      borderWidth: "2px",
    },
    cardSelected: {
      borderColor: theme.palette.primary.main,
      cursor: "pointer",
    },
    cardContent: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    selectableCard: {
      "&:hover": {
        cursor: "pointer",
        borderColor: theme.palette.saleor.active[3],
      },
    },
    selectedLabel: {
      fontSize: "1.4rem",
      lineHeight: "1.75",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    editIcon: {
      color: theme.palette.grey[600],
      "&:hover": {
        color: theme.palette.primary.main,
        cursor: "pointer",
      },
    },
  }),
  { name: "CustomerAddressChoiceCard" },
);
