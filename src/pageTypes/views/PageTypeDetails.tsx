import Button from "@material-ui/core/Button";
import { attributeUrl } from "@saleor/attributes/urls";
import AssignAttributeDialog from "@saleor/components/AssignAttributeDialog";
import AttributeUnassignDialog from "@saleor/components/AttributeUnassignDialog";
import BulkAttributeUnassignDialog from "@saleor/components/BulkAttributeUnassignDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import PageTypeDeleteDialog from "@saleor/pageTypes/components/PageTypeDeleteDialog";
import {
  useAssignPageAttributeMutation,
  usePageTypeAttributeReorderMutation,
  usePageTypeDeleteMutation,
  usePageTypeUpdateMutation,
  useUnassignPageAttributeMutation
} from "@saleor/pageTypes/mutations";
import { ReorderEvent } from "@saleor/types";
import getPageErrorMessage from "@saleor/utils/errors/page";
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
import useAvailablePageAttributeSearch from "../hooks/useAvailablePageAttributeSearch";
import { usePageTypeDetailsQuery } from "../queries";
import { pageTypeListUrl, pageTypeUrl, PageTypeUrlQueryParams } from "../urls";

interface PageTypeDetailsProps {
  id: string;
  params: PageTypeUrlQueryParams;
}

export const PageTypeDetails: React.FC<PageTypeDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const intl = useIntl();

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
      }
    }
  });
  const [deletePageType, deletePageTypeOpts] = usePageTypeDeleteMutation({
    onCompleted: deleteData => {
      if (deleteData.pageTypeDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Page type deleted"
          })
        });
        navigate(pageTypeListUrl(), true);
      }
    }
  });
  const [assignAttribute, assignAttributeOpts] = useAssignPageAttributeMutation(
    {
      onCompleted: data => {
        if (data.pageAttributeAssign.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges)
          });
          closeModal();
        }
      }
    }
  );
  const [
    unassignAttribute,
    unassignAttributeOpts
  ] = useUnassignPageAttributeMutation({
    onCompleted: data => {
      if (data.pageAttributeUnassign.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
        attributeListActions.reset();
      }
    }
  });
  const [reorderAttribute] = usePageTypeAttributeReorderMutation({});

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
  const handlePageTypeDelete = () => deletePageType({ variables: { id } });
  const handleAssignAttribute = () =>
    assignAttribute({
      variables: {
        id,
        ids: params.ids
      }
    });
  const handleAttributeUnassign = () =>
    unassignAttribute({
      variables: {
        id,
        ids: [params.id]
      }
    });
  const handleBulkAttributeUnassign = () =>
    unassignAttribute({
      variables: {
        id,
        ids: params.ids
      }
    });
  const handleAttributeReorder = (event: ReorderEvent) =>
    reorderAttribute({
      variables: {
        move: {
          id: data.pageType.attributes[event.oldIndex].id,
          sortOrder: event.newIndex - event.oldIndex
        },
        pageTypeId: id
      }
    });

  const { data, loading: dataLoading } = usePageTypeDetailsQuery({
    variables: { id }
  });

  const { loadMore, search, result } = useAvailablePageAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id
    }
  });

  const pageType = data?.pageType;

  if (pageType === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const closeModal = () => navigate(pageTypeUrl(id), true);

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
        errors={updatePageTypeOpts.data?.pageTypeUpdate.errors}
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
        onAttributeReorder={handleAttributeReorder}
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
      <PageTypeDeleteDialog
        confirmButtonState={deletePageTypeOpts.status}
        name={getStringOrPlaceholder(data?.pageType.name)}
        hasPages={data?.pageType.hasPages}
        open={params.action === "remove"}
        onClose={() => navigate(pageTypeUrl(id))}
        onConfirm={handlePageTypeDelete}
      />
      {!dataLoading && (
        <AssignAttributeDialog
          attributes={result.data?.pageType.availableAttributes.edges.map(
            edge => edge.node
          )}
          confirmButtonState={assignAttributeOpts.status}
          errors={
            assignAttributeOpts.data?.pageAttributeAssign.errors
              ? assignAttributeOpts.data.pageAttributeAssign.errors.map(err =>
                  getPageErrorMessage(err, intl)
                )
              : []
          }
          loading={result.loading}
          onClose={closeModal}
          onSubmit={handleAssignAttribute}
          onFetch={search}
          onFetchMore={loadMore}
          onOpen={result.refetch}
          hasMore={
            !!result.data?.pageType.availableAttributes.pageInfo.hasNextPage
          }
          open={params.action === "assign-attribute"}
          selected={params.ids || []}
          onToggle={attributeId => {
            const ids = params.ids || [];
            navigate(
              pageTypeUrl(id, {
                ...params,
                ids: ids.includes(attributeId)
                  ? params.ids.filter(selectedId => selectedId !== attributeId)
                  : [...ids, attributeId]
              })
            );
          }}
        />
      )}
      <BulkAttributeUnassignDialog
        title={intl.formatMessage({
          defaultMessage: "Unassign Attribute from Page Type",
          description: "dialog header"
        })}
        attributeQuantity={params.ids?.length}
        confirmButtonState={unassignAttributeOpts.status}
        onClose={closeModal}
        onConfirm={handleBulkAttributeUnassign}
        open={params.action === "unassign-attributes"}
        itemTypeName={getStringOrPlaceholder(data?.pageType.name)}
      />
      <AttributeUnassignDialog
        title={intl.formatMessage({
          defaultMessage: "Unassign Attribute From Page Type",
          description: "dialog header"
        })}
        attributeName={getStringOrPlaceholder(
          data?.pageType.attributes.find(
            attribute => attribute.id === params.id
          )?.name
        )}
        confirmButtonState={unassignAttributeOpts.status}
        onClose={closeModal}
        onConfirm={handleAttributeUnassign}
        open={params.action === "unassign-attribute"}
        itemTypeName={getStringOrPlaceholder(data?.pageType.name)}
      />
    </>
  );
};
export default PageTypeDetails;
