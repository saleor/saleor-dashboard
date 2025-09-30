// @ts-strict-ignore
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  usePageTypeCreateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { useIntl } from "react-intl";

import PageTypeCreatePage, { PageTypeForm } from "../components/PageTypeCreatePage";
import { pageTypeUrl } from "../urls";

const PageTypeCreate = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [createPageType, createPageTypeOpts] = usePageTypeCreateMutation({
    onCompleted: updateData => {
      if (updateData.pageTypeCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "TKQiDp",
            defaultMessage: "Successfully created model type",
          }),
        });
        navigate(pageTypeUrl(updateData.pageTypeCreate.pageType.id));
      }
    },
  });
  const handleCreate = async (formData: PageTypeForm) => {
    const result = await createPageType({
      variables: {
        input: {
          name: formData.name,
        },
      },
    });

    return {
      id: result.data?.pageTypeCreate.pageType?.id || null,
      errors: getMutationErrors(result),
    };
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "vY17L8",
          defaultMessage: "Create Model type",
          description: "window title",
        })}
      />
      <PageTypeCreatePage
        disabled={createPageTypeOpts.loading}
        errors={createPageTypeOpts.data?.pageTypeCreate.errors || []}
        saveButtonBarState={createPageTypeOpts.status}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PageTypeCreate;
