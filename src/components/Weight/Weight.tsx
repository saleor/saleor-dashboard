import { FormattedMessage } from "react-intl";

export interface Weight {
  unit: string;
  value: number;
}
interface WeightProps {
  weight: Weight;
}

const Weight = ({ weight }: WeightProps) => (
  <FormattedMessage
    id="NtFVFS"
    defaultMessage="{value} {unit}"
    description="weight"
    values={weight}
  />
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Weight.displayName = "Weight";
