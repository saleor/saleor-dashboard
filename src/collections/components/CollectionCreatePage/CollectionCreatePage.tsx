import { ChannelCollectionData } from "@saleor/channels/utils";
import { createChannelsChangeHandler } from "@saleor/collections/utils";
import AppHeader from "@saleor/components/AppHeader";
import { AvailabilityCard } from "@saleor/components/AvailabilityCard";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { CollectionChannelListingErrorFragment } from "@saleor/fragments/types/CollectionChannelListingErrorFragment";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { sectionNames } from "@saleor/intl";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { ContentState, convertToRaw, RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";

export interface CollectionCreatePageFormData extends MetadataFormData {
  backgroundImage: {
    url: string;
    value: string;
  };
  backgroundImageAlt: string;
  channelListing: ChannelCollectionData[];
  description: RawDraftContentState;
  name: string;
  slug: string;
  seoDescription: string;
  seoTitle: string;
}

export interface CollectionCreatePageProps {
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  currentChannels: ChannelCollectionData[];
  disabled: boolean;
  errors: CollectionErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: CollectionCreatePageFormData) => void;
  onChannelsChange: (data: ChannelCollectionData[]) => void;
  openChannelsModal: () => void;
}

const CollectionCreatePage: React.FC<CollectionCreatePageProps> = ({
  channelsCount,
  channelsErrors,
  currentChannels = [],
  disabled,
  errors,
  saveButtonBarState,
  onBack,
  onChannelsChange,
  openChannelsModal,
  onSubmit
}: CollectionCreatePageProps) => {
  const intl = useIntl();

  const initialForm: CollectionCreatePageFormData = {
    backgroundImage: {
      url: null,
      value: null
    },
    backgroundImageAlt: "",
    channelListing: currentChannels,
    description: convertToRaw(ContentState.createFromText("")),
    metadata: [],
    name: "",
    privateMetadata: [],
    seoDescription: "",
    seoTitle: "",
    slug: ""
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
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
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Add Collection",
                description: "page header"
              })}
            />
            <Grid>
              <div>
                <CollectionDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CollectionImage
                  image={
                    data.backgroundImage.url
                      ? {
                          __typename: "Image",
                          alt: data.backgroundImageAlt,
                          url: data.backgroundImage.url
                        }
                      : null
                  }
                  onImageDelete={() =>
                    change({
                      target: {
                        name: "backgroundImage",
                        value: {
                          url: null,
                          value: null
                        }
                      }
                    } as any)
                  }
                  onImageUpload={file =>
                    change({
                      target: {
                        name: "backgroundImage",
                        value: {
                          url: URL.createObjectURL(file),
                          value: file
                        }
                      }
                    } as any)
                  }
                  onChange={change}
                  data={data}
                />
                <CardSpacer />
                <SeoForm
                  allowEmptySlug={true}
                  description={data.seoDescription}
                  disabled={disabled}
                  descriptionPlaceholder=""
                  helperText={intl.formatMessage({
                    defaultMessage:
                      "Add search engine title and description to make this collection easier to find"
                  })}
                  slug={data.slug}
                  slugPlaceholder={data.name}
                  title={data.seoTitle}
                  titlePlaceholder={data.name}
                  onChange={change}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
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
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
CollectionCreatePage.displayName = "CollectionCreatePage";
export default CollectionCreatePage;
