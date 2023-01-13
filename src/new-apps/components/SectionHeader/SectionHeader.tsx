import { Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "./styles";

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classes.sectionHeader}>
      {title}
    </Typography>
  );
};
SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
