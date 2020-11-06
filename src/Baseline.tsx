import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import React from "react";

const styles = createStyles((theme: Theme) => ({
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
