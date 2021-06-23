import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryCreateForm, { CategoryCreateData } from "./form";

export interface CategoryCreatePageProps {
  errors: ProductErrorFragment[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit(data: CategoryCreateData);
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
    <CategoryCreateForm onSubmit={onSubmit}>
      {({ data, change, handlers, submit, hasChanged }) => (
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
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
              onDescriptionChange={handlers.changeDescription}
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
            <Metadata data={data} onChange={handlers.changeMetadata} />
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </div>
        </Container>
      )}
    </CategoryCreateForm>
  );
};
CategoryCreatePage.displayName = "CategoryCreatePage";
export default CategoryCreatePage;
