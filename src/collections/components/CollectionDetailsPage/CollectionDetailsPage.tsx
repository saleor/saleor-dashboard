// @ts-strict-ignore
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { defaultGraphiQLQuery } from "@dashboard/collections/queries";
import { collectionListPath, type CollectionUrlQueryParams } from "@dashboard/collections/urls";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCollectionDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type CollectionChannelListingErrorFragment,
  type CollectionDetailsQuery,
  type CollectionErrorFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Divider } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { type ChannelProps, type PageListProps } from "../../../types";
import { CollectionChannelAvailabilityCard } from "../CollectionChannelAvailabilityCard/CollectionChannelAvailabilityCard";
import { CollectionDetails } from "../CollectionDetails/CollectionDetails";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import { CollectionSaveCompositionHint } from "./CollectionSaveCompositionHint";
import CollectionUpdateForm, { type CollectionUpdateData } from "./form";
import { messages } from "./messages";

interface CollectionDetailsPageProps extends PageListProps, ChannelProps {
  channelsCount: number;
  channelCurrencies: Record<string, string>;
  channelsErrors: CollectionChannelListingErrorFragment[];
  collection: CollectionDetailsQuery["collection"];
  backgroundImageRevision?: number;
  backgroundImageUploadPreview?: string | null;
  isBackgroundImageUploading?: boolean;
  onBackgroundImageUploadPreviewLoaded?: () => void;
  currentChannels: ChannelCollectionData[];
  savedChannelListings: ChannelCollectionData[];
  errors: CollectionErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onSubmit: (data: CollectionUpdateData) => SubmitPromise;
  onChannelsChange: (data: ChannelCollectionData[]) => void;
  openChannelsModal: () => void;
  onShowMetadata: () => void;
  params: CollectionUrlQueryParams;
}

const CollectionDetailsPage = ({
  channelsCount,
  channelCurrencies,
  channelsErrors,
  collection,
  backgroundImageRevision = 0,
  backgroundImageUploadPreview = null,
  isBackgroundImageUploading = false,
  onBackgroundImageUploadPreviewLoaded,
  currentChannels = [],
  savedChannelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  onChannelsChange,
  openChannelsModal,
  onShowMetadata,
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
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${collection?.id}" }`);
    context.setDevModeVisibility(true);
  }, [collection?.id, context]);
  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = [...extensionMenuItems];

    if (collection?.id) {
      items.push({
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      });
    }

    if (collection) {
      items.push({
        label: intl.formatMessage(messages.deleteCollection),
        onSelect: onCollectionRemove,
        testId: "delete-collection",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [collection, extensionMenuItems, intl, onCollectionRemove, openPlaygroundURL]);

  return (
    <CollectionUpdateForm
      collection={collection}
      currentChannels={currentChannels}
      savedChannelListings={savedChannelListings}
      setChannels={onChannelsChange}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, handlers, submit, isSaveDisabled, saveComposition }) => {
        return (
          <DetailPageLayout>
            <TopNav
              href={collectionListBackLink}
              hrefIcon={<TopNavDestinationIcon.collections />}
              hrefTitle={intl.formatMessage(topNavDestinationMessages.allCollections)}
              title={collection?.name}
              actionsGap={3}
            >
              <TopNav.MetadataButton
                onClick={onShowMetadata}
                disabled={disabled || !collection}
                data-test-id="show-collection-metadata"
                title={intl.formatMessage(messages.editCollectionMetadata)}
              />
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
              {menuItems.length > 0 && (
                <TopNav.Menu
                  items={
                    disabled || !collection
                      ? menuItems.map(item => ({ ...item, disabled: true }))
                      : menuItems
                  }
                  dataTestId="menu"
                />
              )}
            </TopNav>
            <DetailPageLayout.Content>
              <DetailPageContent>
                <CollectionDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  image={collection?.backgroundImage}
                  backgroundImageRevision={backgroundImageRevision}
                  backgroundImageUploadPreview={backgroundImageUploadPreview}
                  isBackgroundImageUploading={isBackgroundImageUploading}
                  onUploadPreviewLoaded={onBackgroundImageUploadPreviewLoaded}
                  onChange={change}
                  onImageDelete={onImageDelete}
                  onImageUpload={onImageUpload}
                />
                {/*
                  Product assign/unassign and image upload/delete stay live while the form
                  is dirty — they persist immediately and are not part of Save.
                */}
                <CollectionProducts
                  disabled={disabled}
                  collection={collection}
                  currentChannels={currentChannels}
                  {...collectionProductsProps}
                />
                <SeoForm
                  columnInset={false}
                  description={data.seoDescription}
                  disabled={disabled}
                  descriptionPlaceholder=""
                  errors={errors}
                  slug={data.slug}
                  slugPlaceholder={data.name}
                  title={data.seoTitle}
                  titlePlaceholder={collection?.name}
                  onChange={change}
                />
              </DetailPageContent>
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar paddingTop={6}>
              <div>
                <CollectionChannelAvailabilityCard
                  channels={currentChannels}
                  savedChannelListings={savedChannelListings}
                  channelCurrencies={channelCurrencies}
                  totalChannelsCount={channelsCount}
                  errors={channelsErrors}
                  disabled={disabled}
                  managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  onManageClick={openChannelsModal}
                  onChannelChange={handlers.changeChannels}
                />
              </div>
              {COLLECTION_DETAILS_WIDGETS.length > 0 && collection?.id && (
                <>
                  <Divider />
                  <AppWidgets
                    extensions={COLLECTION_DETAILS_WIDGETS}
                    params={{ collectionId: collection.id }}
                  />
                </>
              )}
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.Spacer />
              <CollectionSaveCompositionHint composition={saveComposition} />
              <Savebar.CancelButton onClick={() => navigate(collectionListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </CollectionUpdateForm>
  );
};

CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
