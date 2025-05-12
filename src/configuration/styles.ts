import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

export const useStyles = makeStyles(
  theme => ({
    configurationCategory: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
      },
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 3fr",
      padding: theme.spacing(4, 0),
    },

    configurationItem: {
      display: "grid",
      gap: theme.spacing(4),
      gridTemplateColumns: "1fr 1fr",
    },
    configurationLabel: {
      paddingBottom: 20,
    },

    link: {
      display: "contents",
      marginBottom: theme.spacing(4),
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main,
      },
      fontSize: 48,
    },
    sectionDescription: {},
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600 as const,
    },
    navigationCard: {
      border: `1px solid ${vars.colors.border.default1}`,
      height: 130,
      boxShadow: "none !important",
      "& .MuiCardContent-root": {
        borderRadius: vars.borderRadius[3],
      },
    },
  }),
  { name: "ConfigurationPage" },
);
