import { Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { useStyles } from "./styles";

interface SectionHeaderProps {
  title: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const classes = useStyles();

  return (
    <Text size={6} fontWeight="bold" lineHeight={3} className={classes.sectionHeader}>
      {title}
    </Text>
  );
};
SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
