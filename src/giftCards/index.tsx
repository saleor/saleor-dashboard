import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

import GiftCardSettings from "./GiftCardSettings";
import GiftCardListComponent from "./GiftCardsList";
import {
  GiftCardListUrlQueryParams,
  GiftCardUrlSortField,
} from "./GiftCardsList/types";
import GiftCardUpdateComponent from "./GiftCardUpdate";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";
import {
  giftCardPath,
  giftCardSettingsUrl,
  giftCardsListPath,
  giftCardsSectionUrlName,
} from "./urls";

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
  const qs = parseQs(location.search.substr(1)) as any;
  const params: GiftCardListUrlQueryParams = asSortParams(
    qs,
    GiftCardUrlSortField,
    GiftCardUrlSortField.usedBy,
  );

  return <GiftCardListComponent params={params} />;
};

const Component: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <Routes>
        <Route path={giftCardSettingsUrl} element={GiftCardSettings} />
        <Route path={"*"} element={<GiftCardList />} />
        <Route path={giftCardPath(":id")} element={GiftCardUpdatePage} />
      </Routes>
    </>
  );
};

export default Component;
