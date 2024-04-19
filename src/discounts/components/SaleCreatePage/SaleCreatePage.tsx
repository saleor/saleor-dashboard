import { validateSalePrice } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { createSaleChannelsChangeHandler } from "@dashboard/discounts/handlers";
import { saleListUrl } from "@dashboard/discounts/urls";
import { SALE_CREATE_FORM_ID } from "@dashboard/discounts/views/SaleCreate/consts";
import {
  DiscountErrorFragment,
  PermissionEnum,
  SaleType as SaleTypeEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import DiscountDates from "../DiscountDates";
import { ChannelSaleFormData } from "../SaleDetailsPage";
import SaleInfo from "../SaleInfo";
import SaleType from "../SaleType";
import SaleValue from "../SaleValue";

export interface FormData extends MetadataFormData {
  channelListings: ChannelSaleFormData[];
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  name: string;
  startDate: string;
  startTime: string;
  type: SaleTypeEnum;
  value: string;
}

export interface SaleCreatePageProps {
  allChannelsCount: number;
  channelListings: ChannelSaleFormData[];
  disabled: boolean;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onChannelsChange: (data: ChannelSaleFormData[]) => void;
  openChannelsModal: () => void;
  onSubmit: (data: FormData) => SubmitPromise<any[]>;
}

const SaleCreatePage: React.FC<SaleCreatePageProps> = ({
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  onChannelsChange,
  onSubmit,
  openChannelsModal,
  saveButtonBarState,
  onBack,
}) => {
  const intl = useIntl();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const initialForm: FormData = {
    channelListings,
    endDate: "",
    endTime: "",
    hasEndDate: false,
    name: "",
    startDate: "",
    startTime: "",
    type: SaleTypeEnum.FIXED,
    value: "",
    metadata: [],
    privateMetadata: [],
  };
  const checkIfSaveIsDisabled = (data: FormData) =>
    data.channelListings?.some(channel => validateSalePrice(data, channel)) || disabled;

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      formId={SALE_CREATE_FORM_ID}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, submit, triggerChange }) => {
        const handleChannelChange = createSaleChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange,
          data.type,
        );
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav
              href={saleListUrl()}
              title={intl.formatMessage({
                id: "FWbv/u",
                defaultMessage: "Create Discount",
                description: "page header",
              })}
            />
            <DetailPageLayout.Content>
              <SaleInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <SaleType data={data} disabled={disabled} onChange={change} />
              <SaleValue
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={handleChannelChange}
              />
              <DiscountDates data={data} disabled={disabled} errors={errors} onChange={change} />
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
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

SaleCreatePage.displayName = "SaleCreatePage";
export default SaleCreatePage;
