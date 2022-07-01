import { makeStyles } from "@saleor/macaw-ui";

import { emphasisedTextBlue, greyDark, textColor } from "./constants";

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      width: "100%",
      backgroundColor: "inherit",
      padding: `0 13px`,
      fontSize: theme.spacing(1.5),
    },
    borderedWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      maxHeight: theme.spacing(7.5),
      flex: "0 0 auto",
      padding: theme.spacing(3, 0),
      backgroundImage: `linear-gradient(to right,  ${greyDark} 13%, rgba(255, 255, 255, 0) 0%)`,
      backgroundPosition: "bottom",
      backgroundSize: theme.spacing(1.5, 0.125),
      backgroundRepeat: "repeat-x",
    },
    logoWrapper: {
      lineHeight: 0,
    },
    linkList: {
      display: "flex",
      alignItems: "center",
    },
    link: {
      display: "flex",
      padding: theme.spacing(2),
      color: textColor,
    },
    textEmphasis: {
      color: emphasisedTextBlue,
      textTransform: "uppercase",
      fontWeight: 600,
      fontStyle: "normal",
      paddingLeft: "5px",
    },
    divider: {
      borderRight: `1px solid  ${greyDark}`,
      height: theme.spacing(2),
    },
  }),
  {
    name: "DemoBanner",
  },
);

export default useStyles;
