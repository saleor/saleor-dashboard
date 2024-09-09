import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export interface TabContainerProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

const TabContainer: React.FC<TabContainerProps> = props => {
  const { children } = props;

  return (
    <Box
      className={props.className}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderColor="default1"
      marginTop={6}
    >
      {children}
    </Box>
  );
};

TabContainer.displayName = "TabContainer";

export default TabContainer;
