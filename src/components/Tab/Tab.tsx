import { Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TabProps<T> {
  children?: React.ReactNode;
  isActive: boolean;
  changeTab: (index: T) => void;
  testId?: string;
}

export function Tab<T>(value: T) {
  const Component: React.FC<TabProps<T>> = props => {
    const { children, isActive, changeTab, testId } = props;

    return (
      <Text
        as="span"
        data-test-id={testId}
        color={{
          default: isActive ? "default1" : "default2",
          hover: "default2",
        }}
        __opacity={isActive ? 1 : 0.6}
        borderColor={isActive ? "default2" : "transparent"}
        borderBottomStyle="solid"
        borderBottomWidth={1}
        cursor="pointer"
        display="inline-block"
        fontWeight="regular"
        marginRight={4}
        padding={2}
        transition="ease"
        onClick={() => changeTab(value)}
      >
        {children}
      </Text>
    );
  };

  return Component;
}

export default Tab;
