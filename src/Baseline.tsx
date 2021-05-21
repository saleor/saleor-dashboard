import { CssBaseline } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@saleor/theme";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    "@global": {
      "@import": "url('https://rsms.me/inter/inter.css')",

      // For some reason @import clause must be put on top
      // eslint-disable-next-line sort-keys
      "::selection": {
        background: fade(theme.palette.primary.main, 0.2)
      },
      html: {
        fontSize: "62.5%"
      }
    }
  }),
  { name: "Baseline" }
);

const Baseline: React.FC = () => {
  useStyles();

  return <CssBaseline />;
};
Baseline.displayName = "Baseline";

export default Baseline;
