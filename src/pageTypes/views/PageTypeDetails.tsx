// @ts-strict-ignore
import AssignAttributeDialog from "@dashboard/components/AssignAttributeDialog";
import AttributeUnassignDialog from "@dashboard/components/AttributeUnassignDialog";
import BulkAttributeUnassignDialog from "@dashboard/components/BulkAttributeUnassignDialog";
import { Button } from "@dashboard/components/Button";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import TypeDeleteWarningDialog from "@dashboard/components/TypeDeleteWarningDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  useAssignPageAttributeMutation,
  usePageTypeAttributeReorderMutation,
  usePageTypeDeleteMutation,
  usePageTypeDetailsQuery,
  usePageTypeUpdateMutation,
  useUnassignPageAttributeMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import { useListSelectedItems } from "@dashboard/hooks/useListSelectedItems";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { ReorderEvent } from "@dashboard/types";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useAvailablePageAttributeSearch from "../../searches/useAvailablePageAttributesSearch";
import PageTypeDetailsPage, { PageTypeForm } from "../components/PageTypeDetailsPage";
import usePageTypeDelete from "../hooks/usePageTypeDelete";
import { pageTypeListUrl, pageTypeUrl, PageTypeUrlQueryParams } from "../urls";

interface PageTypeDetailsProps {
  id: string;
  params: PageTypeUrlQueryParams;
}

export const PageTypeDetails: React.FC<PageTypeDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const assignAttributesActions = useListSelectedItems<string>();
  const intl = useIntl();
  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });
  const [updatePageType, updatePageTypeOpts] = usePageTypeUpdateMutation({
    onCompleted: updateData => {
      if (!updateData.pageTypeUpdate.errors || updateData.pageTypeUpdate.errors.length === 0) {
        notifySaved();
      }
    },
  });
  const [deletePageType, deletePageTypeOpts] = usePageTypeDeleteMutation({
    onCompleted: deleteData => {
      if (deleteData.pageTypeDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "W/lDQA",
            defaultMessage: "Model type deleted",
          }),
        });
        navigate(pageTypeListUrl(), { replace: true });
      }
    },
  });
  const [assignAttribute, assignAttributeOpts] = useAssignPageAttributeMutation({
    onCompleted: data => {
      if (data.pageAttributeAssign.errors.length === 0) {
        notifySaved();
        closeModal();
      }
    },
  });
  const [unassignAttribute, unassignAttributeOpts] = useUnassignPageAttributeMutation({
    onCompleted: data => {
      if (data.pageAttributeUnassign.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        closeModal();
        attributeListActions.reset();
      }
    },
  });
  const [reorderAttribute] = usePageTypeAttributeReorderMutation({
    onCompleted: data => {
      if (data.pageTypeReorderAttributes.errors.length === 0) {
        notifySaved();
      }
    },
  });
  const pageTypeDeleteData = usePageTypeDelete({
    singleId: id,
    params,
  });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const handlePageTypeUpdate = async (formData: PageTypeForm) => {
    const result = await updatePageType({
      variables: {
        id,
        input: {
          name: formData.name,
        },
      },
    });

    return result.data.pageTypeUpdate.errors;
  };
  const handlePageTypeDelete = () => deletePageType({ variables: { id } });
  const handleAssignAttribute = async () => {
    await assignAttribute({
      variables: {
        id,
        ids: assignAttributesActions.selectedItems,
      },
    });

    assignAttributesActions.clearSelectedItems();
  };
  const handleAttributeUnassign = () =>
    unassignAttribute({
      variables: {
        id,
        ids: [params.id],
      },
    });
  const handleBulkAttributeUnassign = () =>
    unassignAttribute({
      variables: {
        id,
        ids: attributeListActions.listElements,
      },
    });
  const handleAttributeReorder = (event: ReorderEvent) =>
    reorderAttribute({
      variables: {
        move: {
          id: data.pageType.attributes[event.oldIndex].id,
          sortOrder: event.newIndex - event.oldIndex,
        },
        pageTypeId: id,
      },
    });
  const { data, loading: dataLoading } = usePageTypeDetailsQuery({
    variables: { id },
  });
  const { loadMore, search, result } = useAvailablePageAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id,
    },
  });
  const pageType = data?.pageType;

  if (pageType === null) {
    return <NotFoundPage backHref={pageTypeListUrl()} />;
  }

  const closeModal = () => navigate(pageTypeUrl(id), { replace: true });
  const handleSubmit = createMetadataUpdateHandler(
    data?.pageType,
    handlePageTypeUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
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
              type,
            }),
          )
        }
        onAttributeReorder={handleAttributeReorder}
        onAttributeUnassign={attributeId =>
          navigate(
            pageTypeUrl(id, {
              action: "unassign-attribute",
              id: attributeId,
            }),
          )
        }
        onDelete={() =>
          navigate(
            pageTypeUrl(id, {
              action: "remove",
            }),
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
              onClick={() =>
                navigate(
                  pageTypeUrl(id, {
                    action: "unassign-attributes",
                  }),
                )
              }
            >
              <FormattedMessage
                id="Y3ELdI"
                defaultMessage="Unassign"
                description="unassign attribute from model type, button"
              />
            </Button>
          ),
        }}
      />

      {pageType && (
        <>
          <TypeDeleteWarningDialog
            {...pageTypeDeleteData}
            typesData={[pageType]}
            typesToDelete={[id]}
            onClose={closeModal}
            onDelete={handlePageTypeDelete}
            deleteButtonState={deletePageTypeOpts.status}
          />
          <AssignAttributeDialog
            attributes={mapEdgesToItems(result?.data?.pageType?.availableAttributes)}
            confirmButtonState={assignAttributeOpts.status}
            errors={
              assignAttributeOpts.data?.pageAttributeAssign.errors
                ? assignAttributeOpts.data.pageAttributeAssign.errors.map(err =>
                    getPageErrorMessage(err, intl),
                  )
                : []
            }
            loading={result.loading}
            onClose={() => {
              closeModal();
              assignAttributesActions.clearSelectedItems();
            }}
            onSubmit={handleAssignAttribute}
            onFetch={search}
            onFetchMore={loadMore}
            onOpen={result.refetch}
            hasMore={!!result.data?.pageType.availableAttributes.pageInfo.hasNextPage}
            open={params.action === "assign-attribute"}
            selected={assignAttributesActions.selectedItems}
            onToggle={assignAttributesActions.toggleSelectItem}
          />
        </>
      )}
      <BulkAttributeUnassignDialog
        title={intl.formatMessage({
          id: "N7tQ9P",
          defaultMessage: "Unassign attribute from model type",
          description: "dialog header",
        })}
        attributeQuantity={attributeListActions.listElements.length}
        confirmButtonState={unassignAttributeOpts.status}
        onClose={closeModal}
        onConfirm={handleBulkAttributeUnassign}
        open={params.action === "unassign-attributes"}
        itemTypeName={getStringOrPlaceholder(data?.pageType.name)}
      />
      <AttributeUnassignDialog
        title={intl.formatMessage({
          id: "N7tQ9P",
          defaultMessage: "Unassign attribute from model type",
          description: "dialog header",
        })}
        attributeName={getStringOrPlaceholder(
          data?.pageType.attributes.find(attribute => attribute.id === params.id)?.name,
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
