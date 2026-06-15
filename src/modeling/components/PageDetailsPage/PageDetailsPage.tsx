// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleContainerReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog, {
  type AssignAttributeValueDialogFilterChangeMap,
} from "@dashboard/components/AssignAttributeValueDialog";
import { type AttributeInput, Attributes } from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import VisibilityCard from "@dashboard/components/VisibilityCard";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemForPageDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type PageDetailsFragment,
  type PageErrorWithAttributesFragment,
  PermissionEnum,
  type SearchAttributeValuesQuery,
  type SearchCategoriesQuery,
  type SearchCollectionsQuery,
  type SearchPagesQuery,
  type SearchPageTypesQuery,
  type SearchProductsQuery,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { rippleModelMetadata } from "@dashboard/modeling/ripples/modelMetadata";
import { modelingSection } from "@dashboard/modeling/urls";
import { pageTypeUrl } from "@dashboard/modelTypes/urls";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type Container, type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import PageInfo from "../PageInfo";
import { PageOrganizeContent } from "../PageOrganizeContent/PageOrganizeContent";
import PageForm, { type PageData, type PageSubmitData, type PageUpdateHandlers } from "./form";
import { messages } from "./messages";
import { PageDetailsTitle } from "./Title";

interface PageDetailsPageProps {
  loading: boolean;
  errors: PageErrorWithAttributesFragment[];
  page: PageDetailsFragment | null | undefined;
  pageTypes?: RelayToFlat<SearchPageTypesQuery["search"]>;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  referenceCollections?: RelayToFlat<SearchCollectionsQuery["search"]>;
  referenceCategories?: RelayToFlat<SearchCategoriesQuery["search"]>;
  allowEmptySlug?: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  selectedPageType?: PageDetailsFragment["pageType"];
  attributeValues: RelayToFlat<SearchAttributeValuesQuery["attribute"]["choices"]>;
  onRemove: () => void;
  onShowMetadata?: () => void;
  onSubmit: (data: PageSubmitData) => SubmitPromise;
  fetchPageTypes?: (data: string) => void;
  fetchMorePageTypes?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchReferenceCategories?: (data: string) => void;
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchReferenceCollections?: (data: string) => void;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
  onCloseDialog: () => void;
  onSelectPageType?: (pageTypeId: string) => void;
  onAttributeSelectBlur: () => void;
  onFilterChange?: AssignAttributeValueDialogFilterChangeMap;
}

const PageDetailsPage = ({
  loading,
  errors: apiErrors,
  page,
  pageTypes: pageTypeChoiceList,
  referencePages,
  referenceProducts,
  referenceCollections,
  referenceCategories,
  saveButtonBarState,
  selectedPageType,
  attributeValues,
  onRemove,
  onShowMetadata,
  onSubmit,
  fetchPageTypes,
  fetchMorePageTypes,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchReferenceCategories,
  fetchMoreReferenceCategories,
  fetchReferenceCollections,
  fetchMoreReferenceCollections,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  onSelectPageType,
  onAttributeSelectBlur,
  onFilterChange,
}: PageDetailsPageProps) => {
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const canManageModelTypes =
    user && hasPermission(PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES, user);
  const localizeDate = useDateLocalize();
  const navigate = useNavigator();
  const pageExists = page !== null;
  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;
  const pageTypes = pageTypeChoiceList ? mapNodeToChoice(pageTypeChoiceList) : [];
  const handleAssignReferenceAttribute = (
    attributeValues: Container[],
    data: PageData,
    handlers: PageUpdateHandlers,
  ) => {
    handleContainerReferenceAssignment(
      assignReferencesAttributeId,
      attributeValues,
      data.attributes,
      handlers,
    );
    onCloseDialog();
  };
  const handleSelectPageType = (pageTypeId: string) =>
    onSelectPageType && onSelectPageType(pageTypeId);

  const pageListBackLink = useBackLinkWithState({
    path: modelingSection,
  });

  const { PAGE_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.PAGE_DETAILS);
  const extensionMenuItems = getExtensionsItemForPageDetails(PAGE_DETAILS_MORE_ACTIONS, page?.id);
  const builtInMenuItems = useMemo(() => {
    const items = [];

    if (canManageModelTypes && page?.pageType?.id) {
      items.push({
        label: intl.formatMessage(messages.openModelTypeSettings),
        onSelect: () => navigate(pageTypeUrl(page.pageType.id)),
        testId: "open-model-type-settings",
      });
    }

    return items;
  }, [canManageModelTypes, intl, navigate, page?.pageType?.id]);
  const menuItems = [...extensionMenuItems, ...builtInMenuItems];

  return (
    <PageForm
      page={page}
      pageTypes={pageTypeChoiceList}
      selectedPageType={selectedPageType}
      onSelectPageType={handleSelectPageType}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      referenceCollections={referenceCollections}
      referenceCategories={referenceCategories}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      fetchReferenceCategories={fetchReferenceCategories}
      fetchMoreReferenceCategories={fetchMoreReferenceCategories}
      fetchReferenceCollections={fetchReferenceCollections}
      fetchMoreReferenceCollections={fetchMoreReferenceCollections}
      assignReferencesAttributeId={assignReferencesAttributeId}
      onSubmit={onSubmit}
      disabled={loading}
    >
      {({ change, data, validationErrors, handlers, submit, attributeRichTextGetters }) => {
        const errors = [...apiErrors, ...validationErrors];

        return (
          <DetailPageLayout>
            <TopNav
              href={pageListBackLink}
              title={
                !pageExists ? (
                  intl.formatMessage(messages.title)
                ) : (
                  <PageDetailsTitle page={page} loading={loading} />
                )
              }
              actionsGap={3}
            >
              {pageExists && onShowMetadata && (
                <TopNav.MetadataButton
                  onClick={onShowMetadata}
                  disabled={!page}
                  data-test-id="show-page-metadata"
                  title={intl.formatMessage(messages.editPageMetadata)}
                  ripple={rippleModelMetadata}
                />
              )}
              {canTranslate && (
                <TranslationsButton
                  onClick={() =>
                    navigate(
                      languageEntityUrl(
                        lastUsedLocaleOrFallback,
                        TranslatableEntities.pages,
                        page?.id,
                      ),
                    )
                  }
                />
              )}

              {menuItems.length > 0 && <TopNav.Menu items={menuItems} dataTestId="menu" />}
            </TopNav>
            <DetailPageLayout.Content>
              <PageInfo data={data} disabled={loading} errors={errors} onChange={change} />
              <CardSpacer />
              <SeoForm
                errors={errors}
                allowEmptySlug={!pageExists}
                description={data.seoDescription}
                disabled={loading}
                descriptionPlaceholder={""} // TODO: Cast description to string and trim it
                onChange={change}
                slug={data.slug}
                slugPlaceholder={data.title}
                title={data.seoTitle}
                titlePlaceholder={data.title}
                helperText={intl.formatMessage(messages.seoOptionsDescription)}
              />
              <CardSpacer />
              {data.attributes.length > 0 && (
                <Attributes
                  attributes={data.attributes}
                  attributeValues={attributeValues}
                  disabled={loading}
                  loading={loading}
                  errors={errors}
                  onChange={handlers.selectAttribute}
                  onMultiChange={handlers.selectAttributeMulti}
                  onFileChange={handlers.selectAttributeFile}
                  onReferencesRemove={handlers.selectAttributeReference}
                  onReferencesAddClick={onAssignReferencesClick}
                  onReferencesReorder={handlers.reorderAttributeValue}
                  fetchAttributeValues={fetchAttributeValues}
                  fetchMoreAttributeValues={fetchMoreAttributeValues}
                  onAttributeSelectBlur={onAttributeSelectBlur}
                  richTextGetters={attributeRichTextGetters}
                />
              )}
              {!pageExists && (
                <>
                  <CardSpacer />
                  <Metadata data={data} onChange={handlers.changeMetadata} />
                </>
              )}
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <VisibilityCard
                data={data}
                errors={errors}
                disabled={loading}
                messages={{
                  hiddenLabel: intl.formatMessage(messages.hiddenLabel),
                  hiddenSecondLabel: intl.formatMessage(messages.hiddenSecondLabel, {
                    date: localizeDate(data.publishedAt, "llll"),
                  }),
                  visibleLabel: intl.formatMessage(messages.visibleLabel),
                  setAvailabilityDateLabel: intl.formatMessage(messages.setAvailabilityDate),
                }}
                onChange={change}
              />
              {!pageExists && (
                <>
                  <CardSpacer />
                  <PageOrganizeContent
                    data={data}
                    errors={errors}
                    disabled={loading}
                    pageTypes={pageTypes}
                    pageType={data.pageType}
                    pageTypeInputDisplayValue={data.pageType?.name || ""}
                    onPageTypeChange={handlers.selectPageType}
                    fetchPageTypes={fetchPageTypes}
                    fetchMorePageTypes={fetchMorePageTypes}
                    canChangeType={!page?.pageType}
                  />
                </>
              )}
            </DetailPageLayout.RightSidebar>
            <Savebar>
              {page !== null && <Savebar.DeleteButton onClick={onRemove} />}
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(pageListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={loading}
              />
            </Savebar>
            {canOpenAssignReferencesAttributeDialog && (
              <AssignAttributeValueDialog
                entityType={getReferenceAttributeEntityTypeFromAttribute(
                  assignReferencesAttributeId,
                  data.attributes,
                )}
                attribute={data.attributes.find(({ id }) => id === assignReferencesAttributeId)}
                confirmButtonState={"default"}
                products={referenceProducts}
                pages={referencePages}
                collections={referenceCollections}
                categories={referenceCategories}
                hasMore={handlers.fetchMoreReferences?.hasMore}
                open={canOpenAssignReferencesAttributeDialog}
                onFetch={handlers.fetchReferences}
                onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                loading={handlers.fetchMoreReferences?.loading}
                onClose={onCloseDialog}
                onFilterChange={onFilterChange}
                onSubmit={attributeValues =>
                  handleAssignReferenceAttribute(attributeValues, data, handlers)
                }
              />
            )}
          </DetailPageLayout>
        );
      }}
    </PageForm>
  );
};

PageDetailsPage.displayName = "PageDetailsPage";
export default PageDetailsPage;
