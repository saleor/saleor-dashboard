import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    option: {
      marginTop: theme.spacing(-0.25),
      marginBottom: theme.spacing(),
    },
    tooltipIcon: {
      fill: "#28234A",
      fillOpacity: 0.6,
      "&:hover": {
        fillOpacity: 1,
      },
      position: "absolute",
      padding: theme.spacing(0.25),
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
