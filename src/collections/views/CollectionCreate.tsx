import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { CollectionCreateInput } from "../../types/globalTypes";
import CollectionCreatePage from "../components/CollectionCreatePage/CollectionCreatePage";
import { useCollectionCreateMutation } from "../mutations";
import { collectionListUrl, collectionUrl } from "../urls";

export const CollectionCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

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
        onSubmit={formData =>
          createCollection({
            variables: {
              input: {
                backgroundImage: formData.backgroundImage.value,
                backgroundImageAlt: formData.backgroundImageAlt,
                descriptionJson: JSON.stringify(formData.description),
                isPublished: formData.isPublished,
                name: formData.name,
                seo: {
                  description: formData.seoDescription,
                  title: formData.seoTitle
                }
              }
            }
          })
        }
        saveButtonBarState={createCollectionOpts.status}
      />
    </>
  );
};
export default CollectionCreate;
