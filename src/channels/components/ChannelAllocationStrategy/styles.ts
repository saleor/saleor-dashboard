import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    tooltipIcon: {
      fill: theme.palette.type === "dark" ? "#FAFAFA" : "#28234A",
      fillOpacity: 0.6,
      "&:hover": {
        fillOpacity: 1,
      },
      padding: theme.spacing(0.25),
      marginLeft: theme.spacing(0.5),
      verticalAlign: "bottom",
    },
    preview: {
      display: "flex",
      gap: theme.spacing(1),
      flexWrap: "wrap",
      alignItems: "center",
    },
  }),
  { name: "ChannelAllocationStrategy" },
);
