import {
  getAttributeValuesFromReferences,
  mergeAttributeValues
} from "@saleor/attributes/utils/data";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import VisibilityCard from "@saleor/components/VisibilityCard";
import {
  PageDetailsFragment,
  PageErrorWithAttributesFragment,
  SearchAttributeValuesQuery,
  SearchPagesQuery,
  SearchPageTypesQuery,
  SearchProductsQuery
} from "@saleor/graphql";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import PageInfo from "../PageInfo";
import PageOrganizeContent from "../PageOrganizeContent";
import PageForm, { PageData, PageUpdateHandlers } from "./form";

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
  onBack: () => void;
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
  errors,
  page,
  pageTypes: pageTypeChoiceList,
  referencePages,
  referenceProducts,
  saveButtonBarState,
  selectedPageType,
  attributeValues,
  onBack,
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
  onAttributeSelectBlur
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const pageExists = page !== null;

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const pageTypes = pageTypeChoiceList
    ? mapNodeToChoice(pageTypeChoiceList)
    : [];

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: PageData,
    handlers: PageUpdateHandlers
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes
      )
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
    >
      {({ change, data, valid, handlers, hasChanged, submit }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.pages)}
          </Backlink>
          <PageHeader
            title={
              !pageExists
                ? intl.formatMessage({
                    defaultMessage: "Create Page",
                    description: "page header"
                  })
                : page?.title
            }
          />
          <Grid>
            <div>
              <PageInfo
                data={data}
                disabled={loading}
                errors={errors}
                onChange={change}
                onContentChange={handlers.changeContent}
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
                helperText={intl.formatMessage({
                  defaultMessage:
                    "Add search engine title and description to make this page easier to find"
                })}
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
                />
              )}
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </div>
            <div>
              <CardSpacer />
              <VisibilityCard
                data={data}
                errors={errors}
                disabled={loading}
                messages={{
                  hiddenLabel: intl.formatMessage({
                    defaultMessage: "Hidden",
                    description: "page label"
                  }),
                  hiddenSecondLabel: intl.formatMessage(
                    {
                      defaultMessage: "will be visible from {date}",
                      description: "page"
                    },
                    {
                      date: localizeDate(data.publicationDate, "L")
                    }
                  ),
                  visibleLabel: intl.formatMessage({
                    defaultMessage: "Visible",
                    description: "page label"
                  })
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
            </div>
          </Grid>
          <Savebar
            disabled={loading || !hasChanged || !valid}
            state={saveButtonBarState}
            onCancel={onBack}
            onDelete={page === null ? undefined : onRemove}
            onSubmit={submit}
          />
          {canOpenAssignReferencesAttributeDialog && (
            <AssignAttributeValueDialog
              attributeValues={getAttributeValuesFromReferences(
                assignReferencesAttributeId,
                data.attributes,
                referencePages,
                referenceProducts
              )}
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
        </Container>
      )}
    </PageForm>
  );
};
PageDetailsPage.displayName = "PageDetailsPage";
export default PageDetailsPage;
