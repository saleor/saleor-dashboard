import { ChannelVoucherData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { createChannelsChangeHandler } from "@saleor/discounts/handlers";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { sectionNames } from "@saleor/intl";
import { validatePrice } from "@saleor/products/utils/validation";
import React from "react";
import { useIntl } from "react-intl";

import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "../../../types/globalTypes";
import { RequirementsPicker } from "../../types";
import VoucherDates from "../VoucherDates";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export interface FormData {
  applyOncePerCustomer: boolean;
  applyOncePerOrder: boolean;
  channelListings: ChannelVoucherData[];
  code: string;
  discountType: DiscountValueTypeEnum;
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  hasUsageLimit: boolean;
  minCheckoutItemsQuantity: string;
  requirementsPicker: RequirementsPicker;
  startDate: string;
  startTime: string;
  type: VoucherTypeEnum;
  usageLimit: string;
  value: number;
}

export interface VoucherCreatePageProps {
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  hasChannelChanged: boolean;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onSubmit: (data: FormData) => void;
}

const VoucherCreatePage: React.FC<VoucherCreatePageProps> = ({
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  onBack,
  onChannelsChange,
  onSubmit,
  hasChannelChanged,
  openChannelsModal
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    applyOncePerCustomer: false,
    applyOncePerOrder: false,
    channelListings,
    code: "",
    discountType: DiscountValueTypeEnum.FIXED,
    endDate: "",
    endTime: "",
    hasEndDate: false,
    hasUsageLimit: false,
    minCheckoutItemsQuantity: "0",
    requirementsPicker: RequirementsPicker.NONE,
    startDate: "",
    startTime: "",
    type: VoucherTypeEnum.ENTIRE_ORDER,
    usageLimit: "0",
    value: 0
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange
        );
        const formDisabled = data.channelListings?.some(
          channel =>
            validatePrice(channel.discountValue) ||
            (data.requirementsPicker === RequirementsPicker.ORDER &&
              validatePrice(channel.minSpent))
        );
        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.vouchers)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Create Voucher",
                description: "page header"
              })}
            />
            <Grid>
              <div>
                <VoucherInfo
                  data={data}
                  errors={errors}
                  disabled={disabled}
                  onChange={change}
                  variant="create"
                />
                <CardSpacer />
                <VoucherTypes
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                {data.discountType.toString() !== "SHIPPING" ? (
                  <>
                    <CardSpacer />
                    <VoucherValue
                      data={data}
                      disabled={disabled}
                      errors={errors}
                      onChannelChange={handleChannelChange}
                      onChange={change}
                      variant="create"
                    />
                  </>
                ) : null}
                <CardSpacer />
                <VoucherRequirements
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChannelChange={handleChannelChange}
                  onChange={change}
                />
                <CardSpacer />
                <VoucherLimits
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <VoucherDates
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <ChannelsAvailability
                  selectedChannelsCount={data.channelListings.length}
                  allChannelsCount={allChannelsCount}
                  channelsList={data.channelListings.map(channel => ({
                    id: channel.id,
                    name: channel.name
                  }))}
                  disabled={disabled}
                  openModal={openChannelsModal}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={
                disabled || formDisabled || (!hasChanged && !hasChannelChanged)
              }
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
