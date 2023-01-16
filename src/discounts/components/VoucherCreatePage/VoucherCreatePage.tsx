import { ChannelVoucherData } from "@dashboard/channels/utils";
import { Backlink } from "@dashboard/components/Backlink";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import Container from "@dashboard/components/Container";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Metadata from "@dashboard/components/Metadata";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
} from "@dashboard/discounts/handlers";
import { voucherListUrl } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import {
  DiscountErrorFragment,
  PermissionEnum,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { validatePrice } from "@dashboard/products/utils/validation";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountTypeEnum, RequirementsPicker } from "../../types";
import VoucherDates from "../VoucherDates";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export interface FormData extends VoucherDetailsPageFormData {
  value: number;
}

export interface VoucherCreatePageProps {
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  disabled: boolean;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onSubmit: (data: FormData) => SubmitPromise;
}

const VoucherCreatePage: React.FC<VoucherCreatePageProps> = ({
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  onChannelsChange,
  onSubmit,
  openChannelsModal,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const initialForm: FormData = {
    applyOncePerCustomer: false,
    applyOncePerOrder: false,
    onlyForStaff: false,
    channelListings,
    code: "",
    discountType: DiscountTypeEnum.VALUE_FIXED,
    endDate: "",
    endTime: "",
    hasEndDate: false,
    hasUsageLimit: false,
    minCheckoutItemsQuantity: "0",
    requirementsPicker: RequirementsPicker.NONE,
    startDate: "",
    startTime: "",
    type: VoucherTypeEnum.ENTIRE_ORDER,
    usageLimit: 1,
    used: 0,
    value: 0,
    metadata: [],
    privateMetadata: [],
  };

  const checkIfSaveIsDisabled = (data: FormData) =>
    (data.discountType.toString() !== "SHIPPING" &&
      data.channelListings?.some(
        channel =>
          validatePrice(channel.discountValue) ||
          (data.requirementsPicker === RequirementsPicker.ORDER &&
            validatePrice(channel.minSpent)),
      )) ||
    disabled;

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      formId={VOUCHER_CREATE_FORM_ID}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, submit, triggerChange, set }) => {
        const handleDiscountTypeChange = createDiscountTypeChangeHandler(
          change,
        );
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange,
        );
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={voucherListUrl()}>
              {intl.formatMessage(sectionNames.vouchers)}
            </Backlink>
            <PageHeader
              title={intl.formatMessage({
                id: "PsclSa",
                defaultMessage: "Create Voucher",
                description: "page header",
              })}
            />
            <Grid>
              <div>
                <VoucherInfo
                  data={data}
                  errors={errors}
                  disabled={disabled}
                  onChange={event => handleDiscountTypeChange(data, event)}
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
                  initialUsageLimit={initialForm.usageLimit}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  setData={set}
                  isNewVoucher
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
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                  allChannelsCount={allChannelsCount}
                  channelsList={data.channelListings.map(channel => ({
                    id: channel.id,
                    name: channel.name,
                  }))}
                  disabled={disabled}
                  openModal={openChannelsModal}
                />
              </div>
              <Metadata data={data} onChange={changeMetadata} />
            </Grid>
            <Savebar
              disabled={disabled}
              onCancel={() => navigate(voucherListUrl())}
              onSubmit={submit}
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
