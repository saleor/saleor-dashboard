import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import GiftCardListComponent from "./GiftCardsList";
import { GiftCardListUrlQueryParams } from "./GiftCardsList/types";
import GiftCardUpdatePage from "./GiftCardUpdatePage";
import { giftCardPath, giftCardsListPath } from "./urls";

const GiftCardUpdate: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <GiftCardUpdatePage id={decodeURIComponent(match.params.id)} />;

const GiftCardList: React.FC<RouteComponentProps<any>> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardListUrlQueryParams = qs;

  return <GiftCardListComponent params={params} />;
};

const Component: React.FC = ({}) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <Switch>
        <Route exact path={giftCardsListPath} component={GiftCardList} />
        <Route path={giftCardPath(":id")} component={GiftCardUpdate} />
      </Switch>
    </>
  );
};

export default Component;
