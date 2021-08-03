import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import GiftCardListComponent from "./GiftCardsList";
import { GiftCardListUrlQueryParams } from "./GiftCardsList/types";
import GiftCardUpdatePageComponent from "./GiftCardUpdatePage";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdatePage/types";
import { giftCardsListPath, giftCardUrl } from "./urls";

const GiftCardUpdatePage: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardUpdatePageUrlQueryParams = qs;

  return (
    <GiftCardUpdatePageComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

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
        <Route path={giftCardUrl(":id")} component={GiftCardUpdatePage} />
      </Switch>
    </>
  );
};

export default Component;
