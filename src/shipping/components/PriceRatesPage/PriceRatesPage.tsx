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
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import OrderValue from "@saleor/shipping/components/OrderValue";
import PricingCard from "@saleor/shipping/components/PricingCard";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import { ShippingZone_shippingZone_shippingMethods } from "@saleor/shipping/types/ShippingZone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZoneInfo from "../ShippingZoneInfo";

export interface FormData {
  name: string;
  noLimits: boolean;
}

export interface PriceRatesPageProps {
  channels: any[];
  shippingChannels: ChannelData[];
  disabled: boolean;
  rate?: ShippingZone_shippingZone_shippingMethods;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData, channelsData: any) => void;
  openChannelsModal: () => void;
}

export const PriceRatesPage: React.FC<PriceRatesPageProps> = ({
  channels,
  shippingChannels,
  disabled,
  errors,
  onBack,
  onDelete,
  onSubmit,
  openChannelsModal,
  rate,
  saveButtonBarState
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    name: rate?.name || "",
    noLimits: false
  };

  const [selectedChannels, setSelectedChannels] = useStateFromProps(channels);

  return (
    <Form
      initial={initialForm}
      onSubmit={data => onSubmit(data, selectedChannels)}
    >
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleChannelsChange = createChannelsChangeHandler(
          selectedChannels,
          setSelectedChannels,
          triggerChange
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </AppHeader>
            <PageHeader
              title={
                rate?.name ||
                intl.formatMessage({
                  defaultMessage: "Price Rate Name",
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
                <OrderValue
                  channels={selectedChannels}
                  noLimits={data.noLimits}
                  disabled={disabled}
                  onChange={change}
                  onChannelsChange={handleChannelsChange}
                />
                <CardSpacer />
                <PricingCard
                  channels={shippingChannels}
                  onChange={handleChannelsChange}
                  disabled={disabled}
                />
                <CardSpacer />
              </div>
              <div>
                <ChannelsAvailability
                  allChannelsCount={channels?.length}
                  selectedChannelsCount={shippingChannels?.length}
                  channels={channels}
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
        );
      }}
    </Form>
  );
};

export default PriceRatesPage;
