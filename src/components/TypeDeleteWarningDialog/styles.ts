import { makeStyles } from "@saleor/macaw-ui";

export const useTypeDeleteWarningDialogStyles = makeStyles(
  theme => ({
    centerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    content: {
      width: 600,
    },
    consentLabel: {
      color: theme.palette.primary.main,
    },
    buttonsSection: {
      display: "flex",
      justifyContent: "flex-end",
    },
  }),
  { name: "ProductTypeDeleteWarningDialog" },
);
