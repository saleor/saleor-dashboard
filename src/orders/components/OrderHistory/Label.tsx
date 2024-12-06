import { Text } from "@saleor/macaw-ui-next";

export enum LabelSizes {
  sm = 12,
  md = 14,
}

interface LabelProps {
  text: string;
  size?: LabelSizes;
}

const Label = ({ text, size = 12 }: LabelProps) => (
  <Text size={2} fontWeight="light" color="default2" display="block" style={{ fontSize: size }}>
    {text}
  </Text>
);

export default Label;
