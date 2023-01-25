import { validateSalePrice } from "@dashboard/channels/utils";
import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { Backlink } from "@dashboard/components/Backlink";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import Form from "@dashboard/components/Form";
import Metadata, { MetadataFormData } from "@dashboard/components/Metadata";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import { createSaleChannelsChangeHandler } from "@dashboard/discounts/handlers";
import { SALE_CREATE_FORM_ID } from "@dashboard/discounts/views/SaleCreate/consts";
import {
  DiscountErrorFragment,
  PermissionEnum,
  SaleType as SaleTypeEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

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
    data.channelListings?.some(channel => validateSalePrice(data, channel)) ||
    disabled;

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
          <DetailedContent>
            <Content>
              <Backlink onClick={onBack}>
                {intl.formatMessage(sectionNames.sales)}
              </Backlink>
              <PageHeader
                title={intl.formatMessage({
                  id: "2E1xZ0",
                  defaultMessage: "Create Sale",
                  description: "page header",
                })}
              />
              <SaleInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <SaleType data={data} disabled={disabled} onChange={change} />
              <CardSpacer />
              <SaleValue
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={handleChannelChange}
              />
              <CardSpacer />
              <DiscountDates
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
            </Content>
            <RightSidebar>
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
            </RightSidebar>
            <Metadata data={data} onChange={changeMetadata} />
            <Savebar
              disabled={disabled}
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
            />
          </DetailedContent>
        );
      }}
    </Form>
  );
};
SaleCreatePage.displayName = "SaleCreatePage";
export default SaleCreatePage;
