import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { sectionNames } from "@saleor/intl";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { ContentState, convertToRaw, RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import CategoryDetailsForm from "../../components/CategoryDetailsForm";

export interface FormData extends MetadataFormData {
  description: RawDraftContentState;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
}

const initialData: FormData = {
  description: convertToRaw(ContentState.createFromText("")),
  metadata: [],
  name: "",
  privateMetadata: [],
  seoDescription: "",
  seoTitle: "",
  slug: ""
};

export interface CategoryCreatePageProps {
  errors: ProductErrorFragment[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit(data: FormData);
  onBack();
}

export const CategoryCreatePage: React.FC<CategoryCreatePageProps> = ({
  disabled,
  onSubmit,
  onBack,
  errors,
  saveButtonBarState
}) => {
  const intl = useIntl();
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form onSubmit={onSubmit} initial={initialData} confirmLeave>
      {({ data, change, submit, hasChanged }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.categories)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Create New Category",
                description: "page header"
              })}
            />
            <div>
              <CategoryDetailsForm
                disabled={disabled}
                data={data}
                onChange={change}
                errors={errors}
              />
              <CardSpacer />
              <SeoForm
                allowEmptySlug={true}
                helperText={intl.formatMessage({
                  defaultMessage:
                    "Add search engine title and description to make this category easier to find"
                })}
                slug={data.slug}
                slugPlaceholder={data.name}
                title={data.seoTitle}
                titlePlaceholder={data.name}
                description={data.seoDescription}
                descriptionPlaceholder={data.name}
                loading={disabled}
                onChange={change}
                disabled={disabled}
              />
              <CardSpacer />
              <Metadata data={data} onChange={changeMetadata} />
              <SaveButtonBar
                onCancel={onBack}
                onSave={submit}
                state={saveButtonBarState}
                disabled={disabled || !hasChanged}
              />
            </div>
          </Container>
        );
      }}
    </Form>
  );
};
CategoryCreatePage.displayName = "CategoryCreatePage";
export default CategoryCreatePage;
