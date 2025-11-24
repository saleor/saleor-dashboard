import { ConditionalGiftCardsFilterProver } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import GiftCardSettings from "./GiftCardSettings";
import GiftCardListComponent from "./GiftCardsList";
import { GiftCardListUrlQueryParams, GiftCardUrlSortField } from "./GiftCardsList/types";
import GiftCardUpdateComponent from "./GiftCardUpdate";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";
import { giftCardPath, giftCardSettingsUrl, giftCardsListPath } from "./urls";

const GiftCardUpdatePage = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardUpdatePageUrlQueryParams = qs;

  return <GiftCardUpdateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const GiftCardList = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: GiftCardListUrlQueryParams = asSortParams(
    qs,
    GiftCardUrlSortField,
    GiftCardUrlSortField.usedBy,
  );

  return (
    <ConditionalGiftCardsFilterProver locationSearch={location.search}>
      <GiftCardListComponent params={params} />
    </ConditionalGiftCardsFilterProver>
  );
};

const Component = () => {
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
