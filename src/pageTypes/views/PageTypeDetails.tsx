import AssignAttributeDialog from "@saleor/components/AssignAttributeDialog";
import AttributeUnassignDialog from "@saleor/components/AttributeUnassignDialog";
import BulkAttributeUnassignDialog from "@saleor/components/BulkAttributeUnassignDialog";
import { Button } from "@saleor/components/Button";
import NotFoundPage from "@saleor/components/NotFoundPage";
import TypeDeleteWarningDialog from "@saleor/components/TypeDeleteWarningDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  useAssignPageAttributeMutation,
  usePageTypeAttributeReorderMutation,
  usePageTypeDeleteMutation,
  usePageTypeDetailsQuery,
  usePageTypeUpdateMutation,
  useUnassignPageAttributeMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import { ReorderEvent } from "@saleor/types";
import getPageErrorMessage from "@saleor/utils/errors/page";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useAvailablePageAttributeSearch from "../../searches/useAvailablePageAttributesSearch";
import PageTypeDetailsPage, {
  PageTypeForm,
} from "../components/PageTypeDetailsPage";
import usePageTypeDelete from "../hooks/usePageTypeDelete";
import { pageTypeListUrl, pageTypeUrl, PageTypeUrlQueryParams } from "../urls";

interface PageTypeDetailsProps {
  id: string;
  params: PageTypeUrlQueryParams;
}

export const PageTypeDetails: React.FC<PageTypeDetailsProps> = ({
  id,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const intl = useIntl();

  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });

  const [updatePageType, updatePageTypeOpts] = usePageTypeUpdateMutation({
    onCompleted: updateData => {
      if (
        !updateData.pageTypeUpdate.errors ||
        updateData.pageTypeUpdate.errors.length === 0
      ) {
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
            id: "NGc9kE",
            defaultMessage: "Page type deleted",
          }),
        });
        navigate(pageTypeListUrl(), { replace: true });
      }
    },
  });
  const [assignAttribute, assignAttributeOpts] = useAssignPageAttributeMutation(
    {
      onCompleted: data => {
        if (data.pageAttributeAssign.errors.length === 0) {
          notifySaved();
          closeModal();
        }
      },
    },
  );
  const [
    unassignAttribute,
    unassignAttributeOpts,
  ] = useUnassignPageAttributeMutation({
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
  const handleAssignAttribute = () =>
    assignAttribute({
      variables: {
        id,
        ids: params.ids,
      },
    });
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
        ids: params.ids,
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
                    ids: attributeListActions.listElements,
                  }),
                )
              }
            >
              <FormattedMessage
                id="WFG7Zk"
                defaultMessage="Unassign"
                description="unassign attribute from page type, button"
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
            attributes={mapEdgesToItems(
              result?.data?.pageType?.availableAttributes,
            )}
            confirmButtonState={assignAttributeOpts.status}
            errors={
              assignAttributeOpts.data?.pageAttributeAssign.errors
                ? assignAttributeOpts.data.pageAttributeAssign.errors.map(err =>
                    getPageErrorMessage(err, intl),
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
                    ? params.ids.filter(
                        selectedId => selectedId !== attributeId,
                      )
                    : [...ids, attributeId],
                }),
              );
            }}
          />
        </>
      )}
      <BulkAttributeUnassignDialog
        title={intl.formatMessage({
          id: "Rpfa+t",
          defaultMessage: "Unassign Attribute from Page Type",
          description: "dialog header",
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
          id: "/L8wzi",
          defaultMessage: "Unassign Attribute From Page Type",
          description: "dialog header",
        })}
        attributeName={getStringOrPlaceholder(
          data?.pageType.attributes.find(
            attribute => attribute.id === params.id,
          )?.name,
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
