import { Text } from "@saleor/macaw-ui-next";
import React from "react";

enum LabelSizes {
  sm = 12,
  md = 14,
}

interface LabelProps {
  text: string;
  size?: LabelSizes;
}

const Label: React.FC<LabelProps> = ({ text, size = 12 }) => (
  <Text size={2} fontWeight="light" color="default2" display="block" style={{ fontSize: size }}>
    {text}
  </Text>
);

export default Label;
