import {
  getReferenceAttributeEntityTypeFromAttribute,
  mergeAttributeValues,
} from "@dashboard/attributes/utils/data";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import { AttributeInput, Attributes } from "@dashboard/components/Attributes";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Metadata from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import SeoForm from "@dashboard/components/SeoForm";
import VisibilityCard from "@dashboard/components/VisibilityCard";
import {
  PageDetailsFragment,
  PageErrorWithAttributesFragment,
  SearchAttributeValuesQuery,
  SearchPagesQuery,
  SearchPageTypesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { pageListUrl } from "@dashboard/pages/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import PageInfo from "../PageInfo";
import PageOrganizeContent from "../PageOrganizeContent";
import PageForm, { PageData, PageUpdateHandlers } from "./form";
import { messages } from "./messages";

export interface PageDetailsPageProps {
  loading: boolean;
  errors: PageErrorWithAttributesFragment[];
  page: PageDetailsFragment;
  pageTypes?: RelayToFlat<SearchPageTypesQuery["search"]>;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  allowEmptySlug?: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  selectedPageType?: PageDetailsFragment["pageType"];
  attributeValues: RelayToFlat<
    SearchAttributeValuesQuery["attribute"]["choices"]
  >;
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
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
  onCloseDialog: () => void;
  onSelectPageType?: (pageTypeId: string) => void;
  onAttributeSelectBlur: () => void;
}

const PageDetailsPage: React.FC<PageDetailsPageProps> = ({
  loading,
  errors: apiErrors,
  page,
  pageTypes: pageTypeChoiceList,
  referencePages,
  referenceProducts,
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
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  onSelectPageType,
  onAttributeSelectBlur,
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const navigate = useNavigator();

  const pageExists = page !== null;

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const pageTypes = pageTypeChoiceList
    ? mapNodeToChoice(pageTypeChoiceList)
    : [];

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: PageData,
    handlers: PageUpdateHandlers,
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes,
      ),
    );
    onCloseDialog();
  };

  const handleSelectPageType = (pageTypeId: string) =>
    onSelectPageType && onSelectPageType(pageTypeId);

  return (
    <PageForm
      page={page}
      pageTypes={pageTypeChoiceList}
      selectedPageType={selectedPageType}
      onSelectPageType={handleSelectPageType}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      assignReferencesAttributeId={assignReferencesAttributeId}
      onSubmit={onSubmit}
      disabled={loading}
    >
      {({
        change,
        data,
        validationErrors,
        handlers,
        submit,
        attributeRichTextGetters,
      }) => {
        const errors = [...apiErrors, ...validationErrors];

        return (
          <DetailPageLayout>
            <TopNav
              href={pageListUrl()}
              title={
                !pageExists ? intl.formatMessage(messages.title) : page?.title
              }
            />
            <DetailPageLayout.Content>
              <PageInfo
                data={data}
                disabled={loading}
                errors={errors}
                onChange={change}
              />
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
                  hiddenSecondLabel: intl.formatMessage(
                    messages.hiddenSecondLabel,
                    {
                      date: localizeDate(data.publicationDate),
                    },
                  ),
                  visibleLabel: intl.formatMessage(messages.visibleLabel),
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
            <Savebar
              disabled={loading}
              state={saveButtonBarState}
              onCancel={() => navigate(pageListUrl())}
              onDelete={page === null ? undefined : onRemove}
              onSubmit={submit}
            />
            {canOpenAssignReferencesAttributeDialog && (
              <AssignAttributeValueDialog
                entityType={getReferenceAttributeEntityTypeFromAttribute(
                  assignReferencesAttributeId,
                  data.attributes,
                )}
                confirmButtonState={"default"}
                products={referenceProducts}
                pages={referencePages}
                hasMore={handlers.fetchMoreReferences?.hasMore}
                open={canOpenAssignReferencesAttributeDialog}
                onFetch={handlers.fetchReferences}
                onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                loading={handlers.fetchMoreReferences?.loading}
                onClose={onCloseDialog}
                onSubmit={attributeValues =>
                  handleAssignReferenceAttribute(
                    attributeValues,
                    data,
                    handlers,
                  )
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
