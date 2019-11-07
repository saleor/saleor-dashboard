import React from "react";
import { FormattedMessage } from "react-intl";

export interface Weight {
  unit: string;
  value: number;
}
export interface WeightProps {
  weight: Weight;
}

const Weight: React.FC<WeightProps> = ({ weight }) => (
  <FormattedMessage
    defaultMessage="{value} {unit}"
    description="weight"
    values={weight}
  />
);

Weight.displayName = "Weight";
export default Weight;
