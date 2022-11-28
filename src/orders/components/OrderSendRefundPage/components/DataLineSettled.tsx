import { IMoney } from "@saleor/utils/intl";
import classnames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { dataLineMessages } from "../messages";
import { useDataLineSettledStyles } from "../styles";
import { DataLineMoney } from "./DataLineMoney";

interface DataLineSettledProps {
  unsettledMoney: IMoney;
}

export const DataLineSettled: React.FC<DataLineSettledProps> = ({
  unsettledMoney,
}) => {
  const classes = useDataLineSettledStyles();

  if (!unsettledMoney) {
    return null;
  }

  if (unsettledMoney.amount === 0) {
    return (
      <span className={classnames(classes.text, classes.settled)}>
        <FormattedMessage {...dataLineMessages.settled} />
      </span>
    );
  }

  return (
    <span className={classnames(classes.text, classes.unsettled)}>
      <FormattedMessage {...dataLineMessages.unsettled} />
      &nbsp;
      <DataLineMoney money={unsettledMoney} />
    </span>
  );
};
