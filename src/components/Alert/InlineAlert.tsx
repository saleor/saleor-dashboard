import { Card } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      backgroundColor: theme.palette.error.main,
      padding: theme.spacing(1.5, 2)
    }
  }),
  { name: "InlineAlert" }
);

interface AlertCardProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ children, className }) => {
  const classes = useStyles({});

  return (
    <Card className={classNames(classes.container, className)}>{children}</Card>
  );
};

export default AlertCard;
