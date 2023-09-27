import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
} from "@dashboard/discounts/handlers";
import { voucherListUrl, VoucherUrlDialog } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import {
  DiscountErrorFragment,
  PermissionEnum,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { validatePrice } from "@dashboard/products/utils/validation";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Box } from "@saleor/macaw-ui/next";
import isEqual from "lodash/isEqual";
import React from "react";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";

import { DiscountTypeEnum, RequirementsPicker } from "../../types";
import { VoucherCodes } from "../VoucherCodes";
import { VoucherCodesDeleteDialog } from "../VoucherCodesDeleteDialog";
import {
  GenerateMultipleVoucherCodeFormData,
  VoucherCodesGenerateDialog,
} from "../VoucherCodesGenerateDialog";
import { VoucherCodesManualDialog } from "../VoucherCodesManualDialog";
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
  onMultipleVoucheCodesGenerate: () => void;
  onSingleVoucherCodeGenerate: () => void;
  onModalClose: () => void;
  isModalOpen: (modalName: VoucherUrlDialog) => boolean;
  onVoucherCodesDelete: () => void;
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
  onMultipleVoucheCodesGenerate,
  onSingleVoucherCodeGenerate,
  onModalClose,
  isModalOpen,
  onVoucherCodesDelete,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const { makeChangeHandler: makeMetadataChangeHandler } =
    useMetadataChangeTrigger();

  const initialForm: FormData = {
    applyOncePerCustomer: false,
    applyOncePerOrder: false,
    onlyForStaff: false,
    channelListings,
    name: "",
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
    used: 1,
    usageLimit: 1,
    codes: [],
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

  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
    clearRowSelection,
  } = useRowSelection();

  const generateMultipleIds = (quantity: string, prefix?: string) => {
    return Array.from({ length: Number(quantity) }).map(() => ({
      code: prefix ? `${prefix}-${uuidv4()}` : uuidv4(),
    }));
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      formId={VOUCHER_CREATE_FORM_ID}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, submit, triggerChange, set }) => {
        const handleDiscountTypeChange =
          createDiscountTypeChangeHandler(change);
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange,
        );
        const changeMetadata = makeMetadataChangeHandler(change);

        const handleSetSelectedVoucherCodesIds = (
          rows: number[],
          clearSelection: () => void,
        ) => {
          if (!data.codes) {
            return;
          }

          const rowsIds = rows.map(row => data.codes[row].code).filter(Boolean);
          const haveSaveValues = isEqual(rowsIds, selectedRowIds);

          if (!haveSaveValues) {
            setSelectedRowIds(rowsIds as string[]);
          }

          setClearDatagridRowSelectionCallback(clearSelection);
        };

        const handleGenerateMultipeCodes = ({
          quantity,
          prefix,
        }: GenerateMultipleVoucherCodeFormData) => {
          onModalClose();
          clearRowSelection();
          set({
            codes: [...data.codes, ...generateMultipleIds(quantity, prefix)],
          });
        };

        return (
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
                variant="create"
              />
              <Box marginTop={8}>
                <VoucherCodes
                  codes={data.codes}
                  loading={false}
                  onDeleteCodes={onVoucherCodesDelete}
                  onMultiCodesGenerate={onMultipleVoucheCodesGenerate}
                  onSelectVoucherCodesIds={handleSetSelectedVoucherCodesIds}
                  onSettingsChange={() => {}}
                  onSingleCodesGenerate={onSingleVoucherCodeGenerate}
                  selectedCodesIds={selectedRowIds}
                  settings={{ rowNumber: 10 }}
                  voucherCodesPagination={{} as any}
                />
              </Box>
              <VoucherTypes
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              {data.discountType.toString() !== "SHIPPING" ? (
                <>
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
              <VoucherDates
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
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

            <VoucherCodesManualDialog
              open={isModalOpen("single-codes")}
              confirmButtonTransitionState="default"
              onClose={onModalClose}
              onSubmit={code => {
                set({
                  codes: [...data.codes, { code }],
                });
              }}
            />
            <VoucherCodesGenerateDialog
              open={isModalOpen("multiple-codes")}
              onClose={onModalClose}
              onSubmit={handleGenerateMultipeCodes}
            />
            <VoucherCodesDeleteDialog
              onClose={onModalClose}
              open={isModalOpen("delete-codes")}
              onDelete={() => {
                onModalClose();
                clearRowSelection();
                set({
                  codes: data.codes.filter(
                    ({ code }) => !selectedRowIds.includes(code),
                  ),
                });
              }}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
