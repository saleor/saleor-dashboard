import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import GiftCardsList from "./GiftCardsList";
import GiftCardUpdatePage from "./GiftCardUpdatePage";
import { giftCardPath, giftCardsListPath } from "./urls";

const GiftCardUpdate: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <GiftCardUpdatePage id={decodeURIComponent(match.params.id)} />;

const Component: React.FC = ({}) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <Switch>
        <Route exact path={giftCardsListPath} component={GiftCardsList} />
        <Route path={giftCardPath(":id")} component={GiftCardUpdate} />
      </Switch>
    </>
  );
};

export default Component;
