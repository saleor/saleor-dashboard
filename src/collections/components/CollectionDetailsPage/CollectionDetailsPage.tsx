// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { ChannelCollectionData } from "@dashboard/channels/utils";
import { collectionListPath, CollectionUrlQueryParams } from "@dashboard/collections/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCollectionDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  CollectionChannelListingErrorFragment,
  CollectionDetailsQuery,
  CollectionErrorFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Box, Divider } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ChannelProps, PageListProps } from "../../../types";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import CollectionUpdateForm, { CollectionUpdateData } from "./form";

interface CollectionDetailsPageProps extends PageListProps, ChannelProps {
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  collection: CollectionDetailsQuery["collection"];
  currentChannels: ChannelCollectionData[];
  errors: CollectionErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onSubmit: (data: CollectionUpdateData) => SubmitPromise;
  onChannelsChange: (data: ChannelCollectionData[]) => void;
  openChannelsModal: () => void;
  params: CollectionUrlQueryParams;
}

const CollectionDetailsPage = ({
  channelsCount,
  channelsErrors,
  collection,
  currentChannels = [],
  disabled,
  errors,
  saveButtonBarState,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  onChannelsChange,
  openChannelsModal,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);

  const collectionListBackLink = useBackLinkWithState({
    path: collectionListPath,
  });

  const { COLLECTION_DETAILS_MORE_ACTIONS, COLLECTION_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.COLLECTION_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForCollectionDetails(
    COLLECTION_DETAILS_MORE_ACTIONS,
    collection?.id,
  );

  return (
    <CollectionUpdateForm
      collection={collection}
      currentChannels={currentChannels}
      setChannels={onChannelsChange}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, handlers, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav href={collectionListBackLink} title={collection?.name}>
            {canTranslate && (
              <TranslationsButton
                onClick={() =>
                  navigate(
                    languageEntityUrl(
                      lastUsedLocaleOrFallback,
                      TranslatableEntities.collections,
                      collection.id,
                    ),
                  )
                }
              />
            )}
            {extensionMenuItems.length > 0 && (
              <Box marginLeft={3}>
                <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
              </Box>
            )}
          </TopNav>
          <DetailPageLayout.Content>
            <CollectionDetails data={data} disabled={disabled} errors={errors} onChange={change} />
            <CollectionImage
              data={data}
              image={collection?.backgroundImage}
              onImageDelete={onImageDelete}
              onImageUpload={onImageUpload}
              onChange={change}
            />
            <Metadata data={data} onChange={handlers.changeMetadata} />
            <CollectionProducts
              disabled={disabled}
              collection={collection}
              currentChannels={currentChannels}
              {...collectionProductsProps}
            />
            <SeoForm
              description={data.seoDescription}
              disabled={disabled}
              descriptionPlaceholder=""
              helperText={intl.formatMessage({
                id: "Rj8LxK",
                defaultMessage:
                  "Add search engine title and description to make this collection easier to find",
              })}
              errors={errors}
              slug={data.slug}
              slugPlaceholder={data.name}
              title={data.seoTitle}
              titlePlaceholder={collection?.name}
              onChange={change}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <div>
              <ChannelsAvailabilityCard
                managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
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
                errors={channelsErrors}
                allChannelsCount={channelsCount}
                channels={data.channelListings}
                disabled={disabled}
                onChange={handlers.changeChannels}
                openModal={openChannelsModal}
              />
            </div>
            {COLLECTION_DETAILS_WIDGETS.length > 0 && collection?.id && (
              <>
                <CardSpacer />
                <Divider />
                <AppWidgets
                  extensions={COLLECTION_DETAILS_WIDGETS}
                  params={{ collectionId: collection.id }}
                />
              </>
            )}
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.DeleteButton onClick={onCollectionRemove} />
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(collectionListBackLink)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </CollectionUpdateForm>
  );
};

CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
