import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
} from "@dashboard/discounts/handlers";
import { voucherListUrl } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import { DiscountErrorFragment, PermissionEnum } from "@dashboard/graphql";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { validatePrice } from "@dashboard/products/utils/validation";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import { RequirementsPicker } from "../../types";
import { VoucherCodes } from "../VoucherCodes";
import { GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import VoucherDates from "../VoucherDates";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";
import { initialForm } from "./const";
import { useVoucherCodesPagination } from "./hooks/useVoucherCodesPagination";
import { useVoucherCodesSelection } from "./hooks/useVoucherCodesSelection";
import { generateMultipleIds, voucherCodeExists } from "./utils";

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
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const checkIfSaveIsDisabled = (data: FormData) =>
    (data.discountType.toString() !== "SHIPPING" &&
      data.channelListings?.some(
        channel =>
          validatePrice(channel.discountValue) ||
          (data.requirementsPicker === RequirementsPicker.ORDER && validatePrice(channel.minSpent)),
      )) ||
    disabled;
  const { change, data, triggerChange, set, submit } = useForm<FormData, unknown>(
    { ...initialForm, channelListings },
    onSubmit,
    {
      confirmLeave: true,
      formId: VOUCHER_CREATE_FORM_ID,
      checkIfSaveIsDisabled,
    },
  );
  const { clearRowSelection, setSelectedVoucherCodesIds, selectedRowIds } =
    useVoucherCodesSelection(data.codes);
  const handleDiscountTypeChange = createDiscountTypeChangeHandler(change);
  const handleChannelChange = createChannelsChangeHandler(
    data.channelListings,
    onChannelsChange,
    triggerChange,
  );
  const changeMetadata = makeMetadataChangeHandler(change);
  const handleGenerateMultipleCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    clearRowSelection();
    triggerChange(true);
    set({
      codes: [...generateMultipleIds(quantity, prefix), ...data.codes],
    });
  };
  const handleDeleteVoucherCodes = () => {
    clearRowSelection();
    set({
      codes: data.codes.filter(({ code }) => !selectedRowIds.includes(code)),
    });
  };
  const handleGenerateCustomCode = (code: string) => {
    if (voucherCodeExists(code, data.codes)) {
      throw new Error("Code already exists");
    }

    triggerChange(true);
    set({
      codes: [{ code }, ...data.codes],
    });
  };
  const { pagination, paginatedCodes, settings, onSettingsChange } = useVoucherCodesPagination(
    data.codes,
  );

  return (
    <form onSubmit={submit}>
      <DetailPageLayout>
        <TopNav
          href={voucherListUrl()}
          title={intl.formatMessage({
            id: "PsclSa",
            defaultMessage: "Create Voucher",
            description: "page header",
          })}
        />
        <DetailPageLayout.Content>
          <VoucherInfo
            data={data}
            errors={errors}
            disabled={disabled}
            onChange={event => handleDiscountTypeChange(data, event)}
          />
          <VoucherCodes
            codes={paginatedCodes}
            onDeleteCodes={handleDeleteVoucherCodes}
            onMultiCodesGenerate={handleGenerateMultipleCodes}
            onSelectVoucherCodesIds={setSelectedVoucherCodesIds}
            onSettingsChange={onSettingsChange}
            onCustomCodeGenerate={handleGenerateCustomCode}
            selectedCodesIds={selectedRowIds}
            settings={settings}
            voucherCodesPagination={pagination}
          />
          <VoucherTypes data={data} disabled={disabled} errors={errors} onChange={change} />
          {data.discountType.toString() !== "SHIPPING" ? (
            <VoucherValue
              data={data}
              disabled={disabled}
              errors={errors}
              onChannelChange={handleChannelChange}
              onChange={change}
              variant="create"
            />
          ) : null}
          <VoucherRequirements
            data={data}
            disabled={disabled}
            errors={errors}
            onChannelChange={handleChannelChange}
            onChange={change}
          />
          <VoucherLimits
            data={data}
            initialUsageLimit={initialForm.usageLimit}
            disabled={disabled}
            errors={errors}
            onChange={change}
            setData={set}
            isNewVoucher
          />
          <VoucherDates data={data} disabled={disabled} errors={errors} onChange={change} />
          <Metadata data={data} onChange={changeMetadata} />
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar>
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
        </DetailPageLayout.RightSidebar>
        <Savebar
          disabled={disabled}
          onCancel={() => navigate(voucherListUrl())}
          onSubmit={submit}
          state={saveButtonBarState}
        />
      </DetailPageLayout>
    </form>
  );
};

VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
