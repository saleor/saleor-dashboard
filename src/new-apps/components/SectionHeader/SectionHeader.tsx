import { Typography } from "@material-ui/core";
import React, { ReactNode } from "react";

import { useStyles } from "./styles";

interface SectionHeaderProps {
  title: ReactNode;
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
