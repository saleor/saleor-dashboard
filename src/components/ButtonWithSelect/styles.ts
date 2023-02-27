import { makeStyles } from "@saleor/macaw-ui";

const ITEM_HEIGHT = 48;

export const useStyles = makeStyles(
  theme => ({
    popper: {
      marginTop: theme.spacing(1),
      zIndex: 2,
    },
    paper: {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: "scroll",
    },
    buttonIcon: {
      margin: 0,
    },
  }),
  {
    name: "ButtonWithSelect",
  },
);
