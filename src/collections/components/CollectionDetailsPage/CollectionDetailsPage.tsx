import { ChannelCollectionData } from "@saleor/channels/utils";
import { CardSpacer } from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import {
  CollectionChannelListingErrorFragment,
  CollectionDetailsQuery,
  CollectionErrorFragment,
  PermissionEnum
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelProps, ListActions, PageListProps } from "../../../types";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import CollectionUpdateForm, { CollectionUpdateData } from "./form";

export interface CollectionDetailsPageProps
  extends PageListProps,
    ListActions,
    ChannelProps {
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  collection: CollectionDetailsQuery["collection"];
  currentChannels: ChannelCollectionData[];
  errors: CollectionErrorFragment[];
  hasChannelChanged: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionUpdateData) => SubmitPromise;
  onChannelsChange: (data: ChannelCollectionData[]) => void;
  openChannelsModal: () => void;
}

const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
  channelsCount,
  channelsErrors,
  collection,
  currentChannels = [],
  disabled,
  errors,
  hasChannelChanged,
  saveButtonBarState,
  selectedChannelId,
  onBack,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  onChannelsChange,
  openChannelsModal,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();

  return (
    <CollectionUpdateForm
      collection={collection}
      currentChannels={currentChannels}
      setChannels={onChannelsChange}
      onSubmit={onSubmit}
      disabled={disabled}
      hasChannelChanged={hasChannelChanged}
    >
      {({ change, data, handlers, submit, isSaveDisabled }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.collections)}
          </Backlink>
          <PageHeader title={collection?.name} />
          <Grid>
            <div>
              <CollectionDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
                onDescriptionChange={handlers.changeDescription}
              />
              <CardSpacer />
              <CollectionImage
                data={data}
                image={collection?.backgroundImage}
                onImageDelete={onImageDelete}
                onImageUpload={onImageUpload}
                onChange={change}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
              <CardSpacer />
              <CollectionProducts
                disabled={disabled}
                collection={collection}
                {...collectionProductsProps}
              />
              <CardSpacer />
              <SeoForm
                description={data.seoDescription}
                disabled={disabled}
                descriptionPlaceholder=""
                helperText={intl.formatMessage({
                  defaultMessage:
                    "Add search engine title and description to make this collection easier to find"
                })}
                errors={errors}
                slug={data.slug}
                slugPlaceholder={data.name}
                title={data.seoTitle}
                titlePlaceholder={collection?.name}
                onChange={change}
              />
            </div>
            <div>
              <div>
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  messages={{
                    hiddenLabel: intl.formatMessage({
                      defaultMessage: "Hidden",
                      description: "collection label"
                    }),

                    visibleLabel: intl.formatMessage({
                      defaultMessage: "Visible",
                      description: "collection label"
                    })
                  }}
                  errors={channelsErrors}
                  selectedChannelsCount={data.channelListings.length}
                  allChannelsCount={channelsCount}
                  channels={data.channelListings}
                  disabled={disabled}
                  onChange={handlers.changeChannels}
                  openModal={openChannelsModal}
                />
              </div>
            </div>
          </Grid>
          <Savebar
            state={saveButtonBarState}
            disabled={isSaveDisabled}
            onCancel={onBack}
            onDelete={onCollectionRemove}
            onSubmit={submit}
          />
        </Container>
      )}
    </CollectionUpdateForm>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
