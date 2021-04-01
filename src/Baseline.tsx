import CssBaseline from "@material-ui/core/CssBaseline";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { createStyles, SaleorTheme, withStyles } from "@saleor/theme";
import React from "react";

const styles = createStyles((theme: SaleorTheme) => ({
  "@global": {
    "@import": "url('https://rsms.me/inter/inter.css')",

    // For some reason @import clause must be put on top
    // eslint-disable-next-line sort-keys
    "::selection": {
      background: fade(theme.palette.primary.main, 0.2)
    }
  }
}));

const Baseline = withStyles(styles, {
  name: "Baseline"
})(() => <CssBaseline />);
Baseline.displayName = "Baseline";

export default Baseline;
