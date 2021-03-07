import { Typography } from "@material-ui/core";
import React from "react";

interface LabelProps {
  text: string;
}

const Label: React.FC<LabelProps> = ({ text }) => (
  <Typography variant="caption" color="textSecondary">
    {text}
  </Typography>
);

export default Label;
