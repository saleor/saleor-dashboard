import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    installButton: {
      marginLeft: theme.spacing(2),
      height: 52,
    },
  }),
  {
    name: "InstallWithManifestFormButton",
  },
);
