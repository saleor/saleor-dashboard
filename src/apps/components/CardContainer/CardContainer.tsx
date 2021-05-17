import { Card, CardContent } from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import React from "react";

import { useStyles } from "../../styles";

export interface CardContainerProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, header }) => {
  const classes = useStyles({});

  return (
    <div className={classes.appContainer}>
      <Card>
        {header}
        <CardContent className={classes.appContent}>
          <ResponsiveTable>{children}</ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
};

CardContainer.displayName = "CardContainer";
export default CardContainer;
