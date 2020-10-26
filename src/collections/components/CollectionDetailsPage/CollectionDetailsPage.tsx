import { ChannelCollectionData } from "@saleor/channels/utils";
import { createChannelsChangeHandler } from "@saleor/collections/utils";
import AppHeader from "@saleor/components/AppHeader";
import { AvailabilityCard } from "@saleor/components/AvailabilityCard";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { CollectionChannelListingErrorFragment } from "@saleor/fragments/types/CollectionChannelListingErrorFragment";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { sectionNames } from "@saleor/intl";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";

export interface CollectionDetailsPageFormData extends MetadataFormData {
  backgroundImageAlt: string;
  channelListing: ChannelCollectionData[];
  description: RawDraftContentState;
  name: string;
  slug: string;
  seoDescription: string;
  seoTitle: string;
}

export interface CollectionDetailsPageProps extends PageListProps, ListActions {
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  collection: CollectionDetails_collection;
  currentChannels: ChannelCollectionData[];
  errors: CollectionErrorFragment[];
  hasChannelChanged: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  selectedChannel: string;
  onBack: () => void;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionDetailsPageFormData) => void;
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
  selectedChannel,
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

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleSubmit = (data: CollectionDetailsPageFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form
      initial={{
        backgroundImageAlt: collection?.backgroundImage?.alt || "",
        channelListing: currentChannels,
        description: collection?.descriptionJson
          ? JSON.parse(collection.descriptionJson)
          : "",
        metadata: collection?.metadata?.map(mapMetadataItemToInput),
        name: collection?.name || "",
        privateMetadata: collection?.privateMetadata?.map(
          mapMetadataItemToInput
        ),
        seoDescription: collection?.seoDescription || "",
        seoTitle: collection?.seoTitle || "",
        slug: collection?.slug || ""
      }}
      onSubmit={handleSubmit}
      confirmLeave
    >
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const changeMetadata = makeMetadataChangeHandler(change);
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListing,
          onChannelsChange,
          triggerChange
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.collections)}
            </AppHeader>
            <PageHeader title={collection?.name} />
            <Grid>
              <div>
                <CollectionDetails
                  collection={collection}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
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
                <Metadata data={data} onChange={changeMetadata} />
                <CardSpacer />
                <CollectionProducts
                  disabled={disabled}
                  channelsCount={channelsCount}
                  selectedChannel={selectedChannel}
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
                  selectedChannelsCount={data.channelListing.length}
                  allChannelsCount={channelsCount}
                  channels={currentChannels}
                  disabled={disabled}
                  onChange={handleChannelChange}
                  openModal={openChannelsModal}
                />
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
        );
      }}
    </Form>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
