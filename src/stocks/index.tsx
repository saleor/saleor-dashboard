import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { stockTransferRequestPath } from "./urls";
import TransferRequest from "./views/TransferRequest";
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.stocks)} />
      <Switch>
        <Route
          exact
          path={stockTransferRequestPath}
          component={TransferRequest}
        />
      </Switch>
    </>
  );
};

export default Component;
