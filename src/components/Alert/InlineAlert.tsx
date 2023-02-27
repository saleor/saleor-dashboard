import { Card } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      backgroundColor: theme.palette.error.main,
      padding: theme.spacing(1.5, 2),
    },
  }),
  { name: "InlineAlert" },
);

interface AlertCardProps {
  children?: React.ReactNode | React.ReactNode[];
}

const AlertCard: React.FC<AlertCardProps> = ({ children }) => {
  const classes = useStyles({});

  return <Card className={classes.container}>{children}</Card>;
};

export default AlertCard;
