import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import VisibilityCard from "@saleor/components/VisibilityCard";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import CollectionUpdateForm, { CollectionUpdateData } from "./form";

export interface CollectionDetailsPageProps extends PageListProps, ListActions {
  collection: CollectionDetails_collection;
  errors: ProductErrorFragment[];
  isFeatured: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionUpdateData) => SubmitPromise;
}

const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
  collection,
  disabled,
  errors,
  isFeatured,
  saveButtonBarState,
  onBack,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <CollectionUpdateForm
      collection={collection}
      isFeatured={isFeatured}
      onSubmit={onSubmit}
    >
      {({ change, data, handlers, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.collections)}
          </AppHeader>
          <PageHeader title={maybe(() => collection.name)} />
          <Grid>
            <div>
              <CollectionDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
                onDescriptionChange={handlers.changeDescription}
              />
              <CardSpacer />
              <CollectionImage
                data={data}
                image={maybe(() => collection.backgroundImage)}
                onImageDelete={onImageDelete}
                onImageUpload={onImageUpload}
                onChange={change}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
              <CardSpacer />
              <CollectionProducts
                disabled={disabled}
                collection={collection}
                {...collectionProductsProps}
              />
              <CardSpacer />
              <SeoForm
                description={data.seoDescription}
                disabled={disabled}
                descriptionPlaceholder=""
                helperText={intl.formatMessage({
                  defaultMessage:
                    "Add search engine title and description to make this collection easier to find"
                })}
                errors={errors}
                slug={data.slug}
                slugPlaceholder={data.name}
                title={data.seoTitle}
                titlePlaceholder={maybe(() => collection.name)}
                onChange={change}
              />
            </div>
            <div>
              <div>
                <VisibilityCard
                  data={data}
                  errors={errors}
                  messages={{
                    hiddenLabel: intl.formatMessage({
                      defaultMessage: "Hidden",
                      description: "collection label"
                    }),
                    hiddenSecondLabel: intl.formatMessage(
                      {
                        defaultMessage: "will be visible from {date}",
                        description: "collection"
                      },
                      {
                        date: localizeDate(data.publicationDate, "L")
                      }
                    ),
                    visibleLabel: intl.formatMessage({
                      defaultMessage: "Visible",
                      description: "collection label"
                    })
                  }}
                  onChange={change}
                >
                  <FormSpacer />
                  <Hr />
                  <ControlledCheckbox
                    name={"isFeatured" as keyof CollectionUpdateData}
                    label={intl.formatMessage({
                      defaultMessage: "Feature on Homepage",
                      description: "switch button"
                    })}
                    checked={data.isFeatured}
                    onChange={change}
                    disabled={disabled}
                  />
                </VisibilityCard>
              </div>
            </div>
          </Grid>
          <SaveButtonBar
            state={saveButtonBarState}
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onDelete={onCollectionRemove}
            onSave={submit}
          />
        </Container>
      )}
    </CollectionUpdateForm>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
