import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { Channel_channel } from "../../types/Channel";

export interface ChannelDetailsPageProps {
  channel?: Channel_channel;
  currencyCodes?: SingleAutocompleteChoiceType[];
  disabled: boolean;
  disabledStatus?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack?: () => void;
  onSubmit?: (data: FormData) => void;
  updateChannelStatus?: () => void;
}

const initialData: FormData = {
  currencyCode: "",
  name: "",
  slug: ""
};

export const ChannelDetailsPage: React.FC<ChannelDetailsPageProps> = ({
  channel,
  currencyCodes,
  disabled,
  disabledStatus,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState,
  updateChannelStatus
}) => {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = React.useState("");

  return (
    <Form onSubmit={onSubmit} initial={channel || initialData}>
      {({ change, data, hasChanged, submit }) => {
        const handleCurrencyCodeSelect = createSingleAutocompleteSelectHandler(
          change,
          setSelectedCurrencyCode,
          currencyCodes
        );
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
              {!!updateChannelStatus && (
                <div>
                  <ChannelStatus
                    isActive={channel?.isActive}
                    disabled={disabledStatus}
                    updateChannelStatus={updateChannelStatus}
                  />
                </div>
              )}
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
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
