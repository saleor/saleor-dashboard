import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { DashboardCard } from "../Card";

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

  return <DashboardCard className={classes.container}>{children}</DashboardCard>;
};

export default AlertCard;
