import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    tooltip: {
      "& .MuiTooltip-tooltip": {
        color: theme.palette.getContrastText(theme.palette.text.primary),
      },
    },
  }),
  {
    name: "DateTime",
  },
);
