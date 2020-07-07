import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import React from "react";

import { ChannelForm, FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import { ChannelErrorFragment } from "../../types/ChannelErrorFragment";

export interface ChannelCreatePageProps {
  disabled: boolean;
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

export const ChannelCreatePage: React.FC<ChannelCreatePageProps> = ({
  disabled,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState
}) => (
  <Form onSubmit={data => onSubmit(data)} initial={initialData}>
    {({ change, data, hasChanged, submit }) => (
      <>
        <Grid>
          <div>
            <ChannelForm
              data={data}
              disabled={disabled}
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

ChannelCreatePage.displayName = "ChannelCreatePage";
export default ChannelCreatePage;
