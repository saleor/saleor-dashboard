// @ts-strict-ignore
import { ChannelCollectionData } from "@dashboard/channels/utils";
import { collectionListUrl } from "@dashboard/collections/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import {
  CollectionChannelListingErrorFragment,
  CollectionErrorFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import React from "react";
import { useIntl } from "react-intl";

import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionCreateForm, { CollectionCreateData } from "./form";

interface CollectionCreatePageProps {
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  currentChannels: ChannelCollectionData[];
  disabled: boolean;
  errors: CollectionErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: CollectionCreateData) => SubmitPromise;
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
  onChannelsChange,
  openChannelsModal,
  onSubmit,
}: CollectionCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <CollectionCreateForm
      onSubmit={onSubmit}
      currentChannels={currentChannels}
      setChannels={onChannelsChange}
      disabled={disabled}
    >
      {({ change, data, handlers, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav
            href={collectionListUrl()}
            title={intl.formatMessage({
              id: "Fxa6xp",
              defaultMessage: "Add Collection",
              description: "page header",
            })}
          />
          <DetailPageLayout.Content>
            <CollectionDetails data={data} disabled={disabled} errors={errors} onChange={change} />
            <CardSpacer />
            <CollectionImage
              image={
                data.backgroundImage.url
                  ? {
                      __typename: "Image",
                      alt: data.backgroundImageAlt,
                      url: data.backgroundImage.url,
                    }
                  : null
              }
              onImageDelete={() =>
                change({
                  target: {
                    name: "backgroundImage",
                    value: {
                      url: null,
                      value: null,
                    },
                  },
                } as any)
              }
              onImageUpload={file =>
                change({
                  target: {
                    name: "backgroundImage",
                    value: {
                      url: URL.createObjectURL(file),
                      value: file,
                    },
                  },
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
                id: "Rj8LxK",
                defaultMessage:
                  "Add search engine title and description to make this collection easier to find",
              })}
              slug={data.slug}
              slugPlaceholder={data.name}
              title={data.seoTitle}
              titlePlaceholder={data.name}
              onChange={change}
            />
            <CardSpacer />
            <Metadata data={data} onChange={handlers.changeMetadata} />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <ChannelsAvailabilityCard
              messages={{
                hiddenLabel: intl.formatMessage({
                  id: "V8FhTt",
                  defaultMessage: "Hidden",
                  description: "collection label",
                }),

                visibleLabel: intl.formatMessage({
                  id: "9vQR6c",
                  defaultMessage: "Visible",
                  description: "collection label",
                }),
              }}
              managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
              errors={channelsErrors}
              allChannelsCount={channelsCount}
              channels={data.channelListings}
              disabled={disabled}
              onChange={handlers.changeChannels}
              openModal={openChannelsModal}
            />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(collectionListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </CollectionCreateForm>
  );
};

CollectionCreatePage.displayName = "CollectionCreatePage";
export default CollectionCreatePage;
