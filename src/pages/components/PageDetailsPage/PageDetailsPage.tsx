import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import VisibilityCard from "@saleor/components/VisibilityCard";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { PageTypeFragment } from "@saleor/fragments/types/PageTypeFragment";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import useFormset from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { getAttributeInputFromPageType } from "@saleor/pages/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeMultiChangeHandler,
  createPageTypeSelectHandler
} from "@saleor/pages/utils/handlers";
import { SearchPageTypes_search_edges_node } from "@saleor/searches/types/SearchPageTypes";
import { FetchMoreProps } from "@saleor/types";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState
} from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { PageDetails_page } from "../../types/PageDetails";
import PageAttributes, {
  PageAttributeInput,
  PageAttributeInputData
} from "../PageAttributes";
import PageInfo from "../PageInfo";
import PageOrganizeContent from "../PageOrganizeContent";

export interface FormData extends MetadataFormData {
  content: RawDraftContentState;
  isPublished: boolean;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
  pageType: string;
}

export interface PageCreatePageSubmitData extends FormData {
  attributes: PageAttributeInput[];
}

export interface PageDetailsPageProps {
  disabled: boolean;
  errors: PageErrorWithAttributesFragment[];
  page: PageDetails_page;
  pageTypes?: SearchPageTypes_search_edges_node[];
  allowEmptySlug?: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onRemove: () => void;
  onSubmit: (data: PageCreatePageSubmitData) => void;
  fetchPageTypes?: (data: string) => void;
  fetchMorePageTypes?: FetchMoreProps;
}

const PageDetailsPage: React.FC<PageDetailsPageProps> = ({
  disabled,
  errors,
  page,
  pageTypes,
  saveButtonBarState,
  onBack,
  onRemove,
  onSubmit,
  fetchPageTypes,
  fetchMorePageTypes
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const pageExists = page !== null;

  const initialPageType =
    page?.pageType ||
    pageTypes?.find(pageType => page?.pageType.id === pageType.id);

  const {
    change: changeAttributeData,
    data: attributes,
    set: setAttributeData
  } = useFormset<PageAttributeInputData>(
    page?.pageType ? getAttributeInputFromPageType(initialPageType) : []
  );

  const initialForm: FormData = {
    content: maybe(
      () => JSON.parse(page.contentJson),
      convertToRaw(ContentState.createFromText(""))
    ),
    isPublished: page?.isPublished,
    metadata: pageExists ? page?.metadata?.map(mapMetadataItemToInput) : [],
    pageType: page?.pageType.id || "",
    privateMetadata: pageExists
      ? page?.privateMetadata?.map(mapMetadataItemToInput)
      : [],
    publicationDate: page?.publicationDate || "",
    seoDescription: page?.seoDescription || "",
    seoTitle: page?.seoTitle || "",
    slug: page?.slug || "",
    title: page?.title || ""
  };

  const handleSubmit = (data: FormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      attributes,
      isPublished: data.isPublished || !!data.publicationDate,
      metadata,
      privateMetadata
    });
  };

  const [pageType, setPageType] = useStateFromProps<PageTypeFragment>(
    page?.pageType || null
  );

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handlePageTypeSelect = createPageTypeSelectHandler(
          change,
          setAttributeData,
          setPageType,
          pageTypes
        );
        const handleAttributeChange = createAttributeChangeHandler(
          changeAttributeData,
          triggerChange
        );
        const handleAttributeMultiChange = createAttributeMultiChangeHandler(
          changeAttributeData,
          attributes,
          triggerChange
        );
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.pages)}
            </AppHeader>
            <PageHeader
              title={
                !pageExists
                  ? intl.formatMessage({
                      defaultMessage: "Create Page",
                      description: "page header"
                    })
                  : maybe(() => page.title)
              }
            />
            <Grid>
              <div>
                <PageInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  page={page}
                  onChange={change}
                />
                <CardSpacer />
                <SeoForm
                  errors={errors}
                  allowEmptySlug={!pageExists}
                  description={data.seoDescription}
                  disabled={disabled}
                  descriptionPlaceholder={maybe(
                    () =>
                      convertFromRaw(data.content)
                        .getPlainText()
                        .slice(0, 300),
                    ""
                  )}
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
                {attributes.length > 0 && (
                  <PageAttributes
                    attributes={attributes}
                    disabled={disabled}
                    errors={errors}
                    onChange={handleAttributeChange}
                    onMultiChange={handleAttributeMultiChange}
                  />
                )}
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <VisibilityCard
                  data={data}
                  errors={errors}
                  disabled={disabled}
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
                  disabled={disabled}
                  pageTypes={pageTypes}
                  pageType={pageType}
                  pageTypeInputDisplayValue={pageType?.name || ""}
                  onPageTypeChange={handlePageTypeSelect}
                  fetchPageTypes={fetchPageTypes}
                  fetchMorePageTypes={fetchMorePageTypes}
                  canChangeType={!page?.pageType}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
              onCancel={onBack}
              onDelete={page === null ? undefined : onRemove}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
PageDetailsPage.displayName = "PageDetailsPage";
export default PageDetailsPage;
