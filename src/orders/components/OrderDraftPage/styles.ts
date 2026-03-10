import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@macaw-ui";

export const useAlertStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(3),
      "& .MuiCardContent-root": {
        backgroundColor: "unset",
        paddingRight: vars.spacing[8],
      },
    },
  }),
  { name: "OrderDraftAlert" },
);
