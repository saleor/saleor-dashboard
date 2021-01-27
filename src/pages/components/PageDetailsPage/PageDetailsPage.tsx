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
import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
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
import PageInfo from "../PageInfo";

export interface PageDetailsPageFormData extends MetadataFormData {
  content: RawDraftContentState;
  isPublished: boolean;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
}

export interface PageDetailsPageProps {
  disabled: boolean;
  errors: PageErrorFragment[];
  page: PageDetails_page;
  allowEmptySlug?: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onRemove: () => void;
  onSubmit: (data: PageDetailsPageFormData) => SubmitPromise;
}

const PageDetailsPage: React.FC<PageDetailsPageProps> = ({
  disabled,
  errors,
  page,
  saveButtonBarState,
  onBack,
  onRemove,
  onSubmit
}) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const pageExists = page !== null;

  const initialForm: PageDetailsPageFormData = {
    content: maybe(
      () => JSON.parse(page.contentJson),
      convertToRaw(ContentState.createFromText(""))
    ),
    isPublished: page?.isPublished,
    metadata: pageExists ? page?.metadata?.map(mapMetadataItemToInput) : [],
    privateMetadata: pageExists
      ? page?.privateMetadata?.map(mapMetadataItemToInput)
      : [],
    publicationDate: page?.publicationDate || "",
    seoDescription: page?.seoDescription || "",
    seoTitle: page?.seoTitle || "",
    slug: page?.slug || "",
    title: page?.title || ""
  };

  const handleSubmit = (data: PageDetailsPageFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    return onSubmit({
      ...data,
      isPublished: data.isPublished || !!data.publicationDate,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit }) => {
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
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <CardSpacer />
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
