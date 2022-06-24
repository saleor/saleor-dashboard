import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import GiftCardSettings from "./GiftCardSettings";
import GiftCardListComponent from "./GiftCardsList";
import {
  GiftCardListUrlQueryParams,
  GiftCardUrlSortField,
} from "./GiftCardsList/types";
import GiftCardUpdateComponent from "./GiftCardUpdate";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";
import { giftCardPath, giftCardSettingsUrl, giftCardsListPath } from "./urls";

const GiftCardUpdatePage: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardUpdatePageUrlQueryParams = qs;

  return (
    <GiftCardUpdateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const GiftCardList: React.FC<RouteComponentProps<any>> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardListUrlQueryParams = asSortParams(
    qs,
    GiftCardUrlSortField,
    GiftCardUrlSortField.usedBy,
  );

  return <GiftCardListComponent params={params} />;
};

const Component: React.FC = ({}) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <Switch>
        <Route path={giftCardSettingsUrl} component={GiftCardSettings} />
        <Route exact path={giftCardsListPath} component={GiftCardList} />
        <Route path={giftCardPath(":id")} component={GiftCardUpdatePage} />
      </Switch>
    </>
  );
};

export default Component;
