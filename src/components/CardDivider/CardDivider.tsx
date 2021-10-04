import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    divider: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    }
  }),
  { name: "CardDivider" }
);

const CardDivider: React.FC = () => {
  const classes = useStyles();

  return <hr className={classes.divider} />;
};

export default CardDivider;
