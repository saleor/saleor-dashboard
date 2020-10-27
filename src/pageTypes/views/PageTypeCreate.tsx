import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import PageTypeCreatePage, {
  PageTypeForm
} from "../components/PageTypeCreatePage";
import { usePageTypeCreateMutation } from "../mutations";
import { PageTypeCreate as PageTypeCreateMutation } from "../types/PageTypeCreate";
import { pageTypeListUrl, pageTypeUrl } from "../urls";

export const PageTypeCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [createPageType, createPageTypeOpts] = usePageTypeCreateMutation({
    onCompleted: (updateData: PageTypeCreateMutation) => {
      if (updateData.pageTypeCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Successfully created page type"
          })
        });
        navigate(pageTypeUrl(updateData.pageTypeCreate.pageType.id));
      }
    }
  });

  const handleCreate = async (formData: PageTypeForm) => {
    const result = await createPageType({
      variables: {
        input: {
          name: formData.name
        }
      }
    });

    return result.data?.pageTypeCreate.pageType?.id || null;
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
          defaultMessage: "Create Page Type",
          description: "window title",
          id: "pageTypeCreateHeader"
        })}
      />
      <PageTypeCreatePage
        disabled={createPageTypeOpts.loading}
        errors={createPageTypeOpts.data?.pageTypeCreate.errors || []}
        saveButtonBarState={createPageTypeOpts.status}
        onBack={() => navigate(pageTypeListUrl())}
        onSubmit={handleSubmit}
      />
    </>
  );
};
export default PageTypeCreate;
