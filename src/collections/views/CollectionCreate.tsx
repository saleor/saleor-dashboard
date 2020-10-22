import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { CollectionCreateInput } from "../../types/globalTypes";
import CollectionCreatePage, {
  CollectionCreatePageFormData
} from "../components/CollectionCreatePage/CollectionCreatePage";
import { useCollectionCreateMutation } from "../mutations";
import { collectionListUrl, collectionUrl } from "../urls";

export const CollectionCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [createCollection, createCollectionOpts] = useCollectionCreateMutation({
    onCompleted: data => {
      if (data.collectionCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(collectionUrl(data.collectionCreate.collection.id));
      } else {
        const backgroundImageError = data.collectionCreate.errors.find(
          error =>
            error.field === ("backgroundImage" as keyof CollectionCreateInput)
        );
        if (backgroundImageError) {
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong)
          });
        }
      }
    }
  });

  const getPublicationData = ({
    publicationDate,
    isPublished
  }: CollectionCreatePageFormData) => ({
    isPublished: !!publicationDate || isPublished,
    publicationDate: publicationDate || null
  });

  const handleCreate = async (formData: CollectionCreatePageFormData) => {
    const result = await createCollection({
      variables: {
        input: {
          backgroundImage: formData.backgroundImage.value,
          backgroundImageAlt: formData.backgroundImageAlt,
          descriptionJson: JSON.stringify(formData.description),
          name: formData.name,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle
          },
          ...getPublicationData(formData)
        }
      }
    });

    return result.data?.collectionCreate.collection?.id || null;
  };

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create collection",
          description: "window title"
        })}
      />
      <CollectionCreatePage
        errors={createCollectionOpts.data?.collectionCreate.errors || []}
        onBack={() => navigate(collectionListUrl())}
        disabled={createCollectionOpts.loading}
        onSubmit={handleSubmit}
        saveButtonBarState={createCollectionOpts.status}
      />
    </>
  );
};
export default CollectionCreate;
