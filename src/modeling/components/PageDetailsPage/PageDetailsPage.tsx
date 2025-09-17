// @ts-strict-ignore
import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleContainerReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import { AttributeInput, Attributes } from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import VisibilityCard from "@dashboard/components/VisibilityCard";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemForPageDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  PageDetailsFragment,
  PageErrorWithAttributesFragment,
  PermissionEnum,
  SearchAttributeValuesQuery,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchPageTypesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { modelingSection } from "@dashboard/modeling/urls";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Container, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import PageInfo from "../PageInfo";
import PageOrganizeContent from "../PageOrganizeContent";
import PageForm, { PageData, PageUpdateHandlers } from "./form";
import { messages } from "./messages";

interface PageDetailsPageProps {
  loading: boolean;
  errors: PageErrorWithAttributesFragment[];
  page: PageDetailsFragment;
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
  onSubmit: (data: PageData) => SubmitPromise;
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
}: PageDetailsPageProps) => {
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
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
              title={!pageExists ? intl.formatMessage(messages.title) : page?.title}
            >
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

              {extensionMenuItems.length > 0 && (
                <Box marginLeft={3}>
                  <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
                </Box>
              )}
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
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
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
