import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface VerticalSpacerProps {
  spacing?: number;
}

const useStyles = makeStyles(
  theme => ({
    container: ({ spacing }: VerticalSpacerProps) => ({
      height: theme.spacing(spacing),
    }),
  }),
  { name: "VerticalSpacer" },
);

const VerticalSpacer: React.FC<VerticalSpacerProps> = ({ spacing = 1 }) => {
  const classes = useStyles({ spacing });

  return <div className={classes.container} />;
};

export default VerticalSpacer;
