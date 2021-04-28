import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/theme";
import React from "react";

import CardSpacer from "../CardSpacer";

const useStyles = makeStyles(
  theme => ({
    container: {
      backgroundColor: theme.palette.error.main,
      padding: theme.spacing(1.5, 2)
    },
    description: {
      color: theme.palette.primary.contrastText
    }
  }),
  { name: "InlineAlert" }
);

interface AlertCardProps {
  description?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ description = "" }) => {
  const classes = useStyles({});

  return (
    <>
      <Card className={classes.container}>
        <Typography className={classes.description}>{description}</Typography>
      </Card>
      <CardSpacer />
    </>
  );
};

export default AlertCard;
