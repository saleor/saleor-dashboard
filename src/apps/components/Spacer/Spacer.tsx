import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface SpacerProps {
  spacing?: number;
  type?: "horizontal" | "vertical";
}

const useStyles = makeStyles(
  theme => ({
    container: ({ spacing, type }: SpacerProps) => ({
      [type === "horizontal" ? "width" : "height"]: theme.spacing(spacing)
    })
  }),
  { name: "Spacer" }
);

const Spacer: React.FC<SpacerProps> = ({
  spacing = 1,
  type = "horizontal"
}) => {
  const classes = useStyles({ spacing, type });

  return <div className={classes.container} />;
};

export default Spacer;
