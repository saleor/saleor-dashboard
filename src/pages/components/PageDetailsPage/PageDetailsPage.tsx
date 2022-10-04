import {
  getAttributeValuesFromReferences,
  mergeAttributeValues,
} from "@saleor/attributes/utils/data";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import { Backlink } from "@saleor/components/Backlink";
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
  SearchProductsQuery,
} from "@saleor/graphql";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { pageListUrl } from "@saleor/pages/urls";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import { mapNodeToChoice } from "@saleor/utils/maps";
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
          <Container>
            <Backlink href={pageListUrl()}>
              {intl.formatMessage(sectionNames.pages)}
            </Backlink>
            <PageHeader
              title={
                !pageExists ? intl.formatMessage(messages.title) : page?.title
              }
            />
            <Grid>
              <div>
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
                  helperText={intl.formatMessage(
                    messages.seoOptionsDescription,
                  )}
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
              </div>
              <div>
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
              </div>
            </Grid>
            <Savebar
              disabled={loading}
              state={saveButtonBarState}
              onCancel={() => navigate(pageListUrl())}
              onDelete={page === null ? undefined : onRemove}
              onSubmit={submit}
            />
            {canOpenAssignReferencesAttributeDialog && (
              <AssignAttributeValueDialog
                attributeValues={getAttributeValuesFromReferences(
                  assignReferencesAttributeId,
                  data.attributes,
                  referencePages,
                  referenceProducts,
                )}
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
          </Container>
        );
      }}
    </PageForm>
  );
};
PageDetailsPage.displayName = "PageDetailsPage";
export default PageDetailsPage;
