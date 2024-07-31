import { Text } from "@saleor/macaw-ui-next";
import React, { PropsWithChildren } from "react";

export const Mono: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Text
    style={{
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    }}
    fontSize={2}
    display="block"
  >
    {children}
  </Text>
);
