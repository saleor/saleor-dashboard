import { FormattedMessage } from "react-intl";

export interface Weight {
  unit: string;
  value: number;
}
export interface WeightProps {
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

Weight.displayName = "Weight";
export default Weight;
