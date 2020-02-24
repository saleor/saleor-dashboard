import { ContentState, convertToRaw, RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { sectionNames } from "@saleor/intl";
import { UserError } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";

interface FormData {
  description: RawDraftContentState;
  name: string;
  seoTitle: string;
  seoDescription: string;
}

const initialData: FormData = {
  description: convertToRaw(ContentState.createFromText("")),
  name: "",
  seoDescription: "",
  seoTitle: ""
};

export interface CategoryCreatePageProps {
  errors: UserError[];
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
  return (
    <Form onSubmit={onSubmit} initial={initialData} confirmLeave>
      {({ data, change, submit, hasChanged }) => (
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
              helperText={intl.formatMessage({
                defaultMessage:
                  "Add search engine title and description to make this category easier to find"
              })}
              title={data.seoTitle}
              titlePlaceholder={data.name}
              description={data.seoDescription}
              descriptionPlaceholder={data.name}
              loading={disabled}
              onChange={change}
              disabled={disabled}
            />
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
CategoryCreatePage.displayName = "CategoryCreatePage";
export default CategoryCreatePage;
