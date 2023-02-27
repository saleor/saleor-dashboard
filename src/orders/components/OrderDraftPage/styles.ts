import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

export const useAlertStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(3),
      "& .MuiCardContent-root": {
        backgroundColor: "unset",
        paddingRight: vars.space[11],
      },
    },
  }),
  { name: "OrderDraftAlert" },
);
