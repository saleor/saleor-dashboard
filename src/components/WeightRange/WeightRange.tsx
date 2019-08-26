import React from "react";
import { FormattedMessage } from "react-intl";

import { Weight } from "../Weight";

export interface WeightRangeProps {
  from?: Weight;
  to?: Weight;
}

const WeightRange: React.FC<WeightRangeProps> = ({ from, to }) =>
  from && to ? (
    <FormattedMessage
      defaultMessage="{fromValue} {fromUnit} - {toValue} {toUnit}"
      description="weight"
      values={{
        fromUnit: from.unit,
        fromValue: from.value,
        toUnit: to.unit,
        toValue: to.value
      }}
    />
  ) : from && !to ? (
    <FormattedMessage
      defaultMessage="from {value} {unit}"
      description="weight"
      values={from}
    />
  ) : !from && to ? (
    <FormattedMessage
      defaultMessage="to {value} {unit}"
      description="weight"
      values={to}
    />
  ) : (
    <span>-</span>
  );
WeightRange.displayName = "WeightRange";
export default WeightRange;
