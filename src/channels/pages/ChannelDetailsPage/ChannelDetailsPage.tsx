import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import React from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { Channel_channel } from "../../types/Channel";

export interface ChannelDetailsPageProps {
  channel?: Channel_channel;
  disabled: boolean;
  editableCurrency?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack?: () => void;
  onSubmit?: (data: FormData) => void;
}

const initialData: FormData = {
  currencyCode: "",
  name: "",
  slug: ""
};

export const ChannelDetailsPage: React.FC<ChannelDetailsPageProps> = ({
  channel,
  disabled,
  editableCurrency = true,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState
}) => (
  <Form onSubmit={onSubmit} initial={channel || initialData}>
    {({ change, data, hasChanged, submit }) => (
      <>
        <Grid>
          <div>
            <ChannelForm
              data={data}
              disabled={disabled}
              editableCurrency={editableCurrency}
              onChange={change}
              errors={errors}
            />
          </div>
          <div>
            <ChannelStatus isActive={false} />
          </div>
        </Grid>
        <SaveButtonBar
          onCancel={onBack}
          onSave={submit}
          state={saveButtonBarState}
          disabled={disabled || !onSubmit || !hasChanged}
        />
      </>
    )}
  </Form>
);

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
