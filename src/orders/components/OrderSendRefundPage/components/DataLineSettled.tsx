import { IMoney } from "@dashboard/utils/intl";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

import { dataLineMessages } from "../messages";
import { useDataLineSettledStyles } from "../styles";
import { DataLineMoney } from "./DataLineMoney";

interface DataLineSettledProps {
  unsettledMoney: IMoney;
}

export const DataLineSettled = ({ unsettledMoney }: DataLineSettledProps) => {
  const classes = useDataLineSettledStyles();

  if (!unsettledMoney) {
    return null;
  }

  if (unsettledMoney.amount === 0) {
    return (
      <span className={clsx(classes.text, classes.settled)}>
        <FormattedMessage {...dataLineMessages.settled} />
      </span>
    );
  }

  return (
    <span className={clsx(classes.text, classes.unsettled)}>
      <FormattedMessage {...dataLineMessages.unsettled} />
      &nbsp;
      <DataLineMoney money={unsettledMoney} />
    </span>
  );
};
