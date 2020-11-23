import { ChannelCollectionData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import { AvailabilityCard } from "@saleor/components/AvailabilityCard";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { CollectionChannelListingErrorFragment } from "@saleor/fragments/types/CollectionChannelListingErrorFragment";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelProps, ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";
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
  collection: CollectionDetails_collection;
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
    >
      {({ change, data, handlers, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.collections)}
          </AppHeader>
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
                channelsCount={channelsCount}
                selectedChannelId={selectedChannelId}
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
                <AvailabilityCard
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
          <SaveButtonBar
            state={saveButtonBarState}
            disabled={disabled || (!hasChanged && !hasChannelChanged)}
            onCancel={onBack}
            onDelete={onCollectionRemove}
            onSave={submit}
          />
        </Container>
      )}
    </CollectionUpdateForm>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
