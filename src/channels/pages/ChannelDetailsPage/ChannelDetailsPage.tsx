import ShippingZonesCard from "@saleor/channels/components/ShippingZonesCard/ShippingZonesCard";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import {
  getParsedSearchData,
  getSearchFetchMoreProps
} from "@saleor/hooks/makeTopLevelSearch/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  getById,
  getByUnmatchingId
} from "@saleor/orders/components/OrderReturnPage/utils";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React, { useState } from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import {
  Channel_channel,
  Channel_channel_shippingZones
} from "../../types/Channel";
import { getUpdatedIdsWithNewId, getUpdatedIdsWithoutNewId } from "./utils";

export interface ChannelDetailsPageProps {
  channel?: Channel_channel;
  currencyCodes?: SingleAutocompleteChoiceType[];
  disabled: boolean;
  disabledStatus?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack?: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
  updateChannelStatus?: () => void;
}

export const ChannelDetailsPage: React.FC<ChannelDetailsPageProps> = ({
  channel,
  currencyCodes,
  disabled,
  disabledStatus,
  onSubmit,
  errors,
  onBack,
  onDelete,
  saveButtonBarState,
  updateChannelStatus
}) => {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");

  const [shippingZonesToDisplay, setShippingZonesToDisplay] = useStateFromProps<
    Channel_channel_shippingZones[]
  >(channel?.shippingZones || []);

  console.log({ sh: channel?.shippingZones, shippingZonesToDisplay });

  const initialData: FormData = {
    currencyCode: "",
    name: "",
    slug: "",
    shippingZonesIdsToAdd: [],
    shippingZonesIdsToRemove: [],
    ...channel
  };

  const {
    loadMore: fetchMoreShippingZones,
    search: searchShippingZones,
    result: searchShippingZonesResult
  } = useShippingZonesSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const getFilteredShippingZonesChoices = () =>
    getParsedSearchData(searchShippingZonesResult).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.map(({ id }) => id).includes(searchedZoneId)
    );

  return (
    <Form onSubmit={onSubmit} initial={initialData}>
      {({ change, data, hasChanged, submit, triggerChange, set }) => {
        const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCurrencyCode,
          currencyCodes
        );

        const addShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToRemove: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToRemove,
              zoneId
            ),
            shippingZonesIdsToAdd: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToAdd,
              zoneId
            )
          });

          triggerChange();

          setShippingZonesToDisplay([
            ...shippingZonesToDisplay,
            getParsedSearchData(searchShippingZonesResult).find(getById(zoneId))
          ]);
        };

        const removeShippingZone = (zoneId: string) => {
          set({
            ...data,
            shippingZonesIdsToAdd: getUpdatedIdsWithoutNewId(
              data.shippingZonesIdsToAdd,
              zoneId
            ),
            shippingZonesIdsToRemove: getUpdatedIdsWithNewId(
              data.shippingZonesIdsToRemove,
              zoneId
            )
          });

          triggerChange();

          setShippingZonesToDisplay(
            shippingZonesToDisplay.filter(getByUnmatchingId(zoneId))
          );
        };

        const formDisabled = !data.name || !data.slug || !data.currencyCode;

        return (
          <>
            <Grid>
              <div>
                <ChannelForm
                  data={data}
                  disabled={disabled}
                  currencyCodes={currencyCodes}
                  selectedCurrencyCode={selectedCurrencyCode}
                  onChange={change}
                  onCurrencyCodeChange={handleCurrencyCodeSelect}
                  errors={errors}
                />
              </div>
              <div>
                {!!updateChannelStatus && (
                  <>
                    <ChannelStatus
                      isActive={channel?.isActive}
                      disabled={disabledStatus}
                      updateChannelStatus={updateChannelStatus}
                    />
                    <CardSpacer />
                  </>
                )}
                <ShippingZonesCard
                  shippingZonesChoices={getFilteredShippingZonesChoices()}
                  shippingZones={shippingZonesToDisplay}
                  addShippingZone={addShippingZone}
                  removeShippingZone={removeShippingZone}
                  searchShippingZones={searchShippingZones}
                  fetchMoreShippingZones={getSearchFetchMoreProps(
                    searchShippingZonesResult,
                    fetchMoreShippingZones
                  )}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              onDelete={onDelete}
              state={saveButtonBarState}
              disabled={disabled || formDisabled || !onSubmit || !hasChanged}
            />
          </>
        );
      }}
    </Form>
  );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
