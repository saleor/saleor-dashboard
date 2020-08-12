import { ChannelData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import Pricing from "@saleor/shipping/components/Pricing";
import { ShippingZone_shippingZone_shippingMethods } from "@saleor/shipping/types/ShippingZone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZoneInfo from "../ShippingZoneInfo";

export interface FormData {
  name: string;
  noLimits: boolean;
  maxValue: string;
  minValue: string;
}

export interface WeightRatesPageProps {
  channels: any[];
  shippingChannels: ChannelData[];
  disabled: boolean;
  rate?: ShippingZone_shippingZone_shippingMethods;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
  openChannelsModal: () => void;
}

export const WeightRatesPage: React.FC<WeightRatesPageProps> = ({
  channels,
  disabled,
  errors,
  onBack,
  onDelete,
  onSubmit,
  openChannelsModal,
  rate,
  saveButtonBarState,
  shippingChannels
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    maxValue: rate?.maximumOrderWeight?.value.toString() || "0",
    minValue: rate?.minimumOrderWeight?.value.toString() || "0",
    name: rate?.name || "",
    noLimits: false
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            <FormattedMessage defaultMessage="Shipping" />
          </AppHeader>
          <PageHeader
            title={
              rate?.name ||
              intl.formatMessage({
                defaultMessage: "Weight Rate Name",
                description: "page title"
              })
            }
          />
          <Grid>
            <div>
              <ShippingZoneInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <OrderWeight
                noLimits={data.noLimits}
                disabled={disabled}
                minValue={data.minValue}
                maxValue={data.maxValue}
                onChange={change}
                errors={errors}
              />
              <CardSpacer />
              <Pricing channels={channels} disabled={disabled} />
              <CardSpacer />
            </div>
            <div>
              <ChannelsAvailability
                allChannelsCount={channels?.length}
                selectedChannelsCount={shippingChannels?.length}
                channels={shippingChannels}
                openModal={openChannelsModal}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onDelete={onDelete}
            onSave={submit}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};

export default WeightRatesPage;
