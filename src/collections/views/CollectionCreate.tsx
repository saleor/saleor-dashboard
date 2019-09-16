import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationState, maybe } from "../../misc";
import { CollectionCreateInput } from "../../types/globalTypes";
import CollectionCreatePage from "../components/CollectionCreatePage/CollectionCreatePage";
import { TypedCollectionCreateMutation } from "../mutations";
import { CreateCollection } from "../types/CreateCollection";
import { collectionListUrl, collectionUrl } from "../urls";

export const CollectionCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleCollectionCreateSuccess = (data: CreateCollection) => {
    if (data.collectionCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Created collection"
        })
      });
      navigate(collectionUrl(data.collectionCreate.collection.id));
    } else {
      const backgroundImageError = data.collectionCreate.errors.find(
        error =>
          error.field === ("backgroundImage" as keyof CollectionCreateInput)
      );
      if (backgroundImageError) {
        notify({
          text: backgroundImageError.message
        });
      }
    }
  };
  return (
    <TypedCollectionCreateMutation onCompleted={handleCollectionCreateSuccess}>
      {(createCollection, { called, data, loading }) => {
        const formTransitionState = getMutationState(
          called,
          loading,
          maybe(() => data.collectionCreate.errors)
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
              errors={maybe(() => data.collectionCreate.errors, [])}
              onBack={() => navigate(collectionListUrl())}
              disabled={loading}
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
              saveButtonBarState={formTransitionState}
            />
          </>
        );
      }}
    </TypedCollectionCreateMutation>
  );
};
export default CollectionCreate;
