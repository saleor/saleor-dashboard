import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import SeoForm from "@saleor/components/SeoForm";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { sectionNames } from "@saleor/intl";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";

export interface CollectionDetailsPageFormData extends MetadataFormData {
  backgroundImageAlt: string;
  description: RawDraftContentState;
  name: string;
  slug: string;
  seoDescription: string;
  seoTitle: string;
  isFeatured: boolean;
}

export interface CollectionDetailsPageProps extends PageListProps, ListActions {
  channelsCount: number;
  collection: CollectionDetails_collection;
  errors: CollectionErrorFragment[];
  isFeatured: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  selectedChannel: string;
  onBack: () => void;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionDetailsPageFormData) => void;
}

const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
  channelsCount,
  collection,
  disabled,
  errors,
  isFeatured,
  saveButtonBarState,
  selectedChannel,
  onBack,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();
  // const localizeDate = useDateLocalize();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleSubmit = (data: CollectionDetailsPageFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      isPublished: data.isPublished || !!data.publicationDate,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form
      initial={{
        backgroundImageAlt: collection?.backgroundImage?.alt || "",
        description: collection?.descriptionJson
          ? JSON.parse(collection.descriptionJson)
          : "",
        isFeatured,
        metadata: collection?.metadata?.map(mapMetadataItemToInput),
        name: collection?.name || "",
        privateMetadata: collection?.privateMetadata?.map(
          mapMetadataItemToInput
        ),
        seoDescription: collection?.seoDescription || "",
        seoTitle: collection?.seoTitle || "",
        slug: collection?.slug || ""
      }}
      onSubmit={handleSubmit}
      confirmLeave
    >
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.collections)}
            </AppHeader>
            <PageHeader title={collection?.name} />
            <Grid>
              <div>
                <CollectionDetails
                  collection={collection}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CollectionImage
                  data={data}
                  image={collection?.backgroundImage}
                  onImageDelete={onImageDelete}
                  onImageUpload={onImageUpload}
                  onChange={change}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
                <CardSpacer />
                <CollectionProducts
                  disabled={disabled}
                  channelsCount={channelsCount}
                  selectedChannel={selectedChannel}
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
                  titlePlaceholder={collection?.name}
                  onChange={change}
                />
              </div>
              <div></div>
            </Grid>
            <SaveButtonBar
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onDelete={onCollectionRemove}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
