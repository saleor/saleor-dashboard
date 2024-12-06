import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface VerticalSpacerProps {
  spacing?: number;
}

const useStyles = makeStyles(
  theme => ({
    container: ({ spacing }: Required<VerticalSpacerProps>) => ({
      height: theme.spacing(spacing),
    }),
  }),
  { name: "VerticalSpacer" },
);
const VerticalSpacer = ({ spacing = 1 }: VerticalSpacerProps) => {
  const classes = useStyles({ spacing });

  return <div className={classes.container} />;
};

export default VerticalSpacer;
