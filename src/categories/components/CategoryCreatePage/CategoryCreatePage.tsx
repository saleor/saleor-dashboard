import { CardSpacer } from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
import { ProductErrorFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
    <CategoryCreateForm onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, handlers, submit, isSaveDisabled }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.categories)}
          </Backlink>
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
            <Savebar
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </div>
        </Container>
      )}
    </CategoryCreateForm>
  );
};
CategoryCreatePage.displayName = "CategoryCreatePage";
export default CategoryCreatePage;
