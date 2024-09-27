import React from "react";
import { FormattedMessage } from "react-intl";

export interface Weight {
  unit: string;
  value: number;
}
interface WeightProps {
  weight: Weight;
}

const Weight: React.FC<WeightProps> = ({ weight }) => (
  <FormattedMessage
    id="NtFVFS"
    defaultMessage="{value} {unit}"
    description="weight"
    values={weight}
  />
);

Weight.displayName = "Weight";
