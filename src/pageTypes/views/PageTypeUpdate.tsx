import Button from "@material-ui/core/Button";
import { attributeUrl } from "@saleor/attributes/urls";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { usePageTypeUpdateMutation } from "@saleor/pageTypes/mutations";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeDetailsPage, {
  PageTypeForm
} from "../components/PageTypeDetailsPage";
import { usePageTypeDetailsQuery } from "../queries";
import { pageTypeListUrl, pageTypeUrl, PageTypeUrlQueryParams } from "../urls";

interface PageTypeUpdateProps {
  id: string;
  params: PageTypeUrlQueryParams;
}

export const PageTypeUpdate: React.FC<PageTypeUpdateProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const intl = useIntl();
  const [errors, setErrors] = React.useState({
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: []
  });

  const [updatePageType, updatePageTypeOpts] = usePageTypeUpdateMutation({
    onCompleted: updateData => {
      if (
        !updateData.pageTypeUpdate.errors ||
        updateData.pageTypeUpdate.errors.length === 0
      ) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      } else if (
        updateData.pageTypeUpdate.errors !== null &&
        updateData.pageTypeUpdate.errors.length > 0
      ) {
        setErrors(prevErrors => ({
          ...prevErrors,
          formErrors: updateData.pageTypeUpdate.errors
        }));
      }
    }
  });

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const handleBack = () => navigate(pageTypeListUrl());

  const handlePageTypeUpdate = async (formData: PageTypeForm) => {
    const result = await updatePageType({
      variables: {
        id,
        input: {
          name: formData.name
        }
      }
    });

    return result.data.pageTypeUpdate.errors;
  };

  const { data, loading: dataLoading } = usePageTypeDetailsQuery({
    variables: { id }
  });

  const pageType = data?.pageType;

  if (pageType === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const handleSubmit = createMetadataUpdateHandler(
    data?.pageType,
    handlePageTypeUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  const loading = updatePageTypeOpts.loading || dataLoading;

  return (
    <>
      <WindowTitle title={data?.pageType.name} />
      <PageTypeDetailsPage
        disabled={loading}
        errors={errors.formErrors}
        pageTitle={data?.pageType.name}
        pageType={data?.pageType}
        saveButtonBarState={updatePageTypeOpts.status}
        onAttributeAdd={type =>
          navigate(
            pageTypeUrl(id, {
              action: "assign-attribute",
              type
            })
          )
        }
        onAttributeClick={attributeId => navigate(attributeUrl(attributeId))}
        onAttributeReorder={() => undefined}
        onAttributeUnassign={attributeId =>
          navigate(
            pageTypeUrl(id, {
              action: "unassign-attribute",
              id: attributeId
            })
          )
        }
        onBack={handleBack}
        onDelete={() =>
          navigate(
            pageTypeUrl(id, {
              action: "remove"
            })
          )
        }
        onSubmit={handleSubmit}
        attributeList={{
          isChecked: attributeListActions.isSelected,
          selected: attributeListActions.listElements.length,
          toggle: attributeListActions.toggle,
          toggleAll: attributeListActions.toggleAll,
          toolbar: (
            <Button
              color="primary"
              onClick={() =>
                navigate(
                  pageTypeUrl(id, {
                    action: "unassign-attributes",
                    ids: attributeListActions.listElements
                  })
                )
              }
            >
              <FormattedMessage
                defaultMessage="Unassign"
                description="unassign attribute from page type, button"
              />
            </Button>
          )
        }}
      />
    </>
  );
};
export default PageTypeUpdate;
