// @ts-strict-ignore
import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import AssignAttributeDialog from "@dashboard/components/AssignAttributeDialog";
import { AttributeUnassignDialog } from "@dashboard/components/AttributeUnassignDialog";
import { BulkAttributeUnassignDialog } from "@dashboard/components/BulkAttributeUnassignDialog";
import { Button } from "@dashboard/components/Button";
import {
  type AttributeCreateSubmitData,
  CreateAttributeDialog,
} from "@dashboard/components/CreateAttributeDialog/CreateAttributeDialog";
import { messages as createAttributeMessages } from "@dashboard/components/CreateAttributeDialog/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import TypeDeleteWarningDialog from "@dashboard/components/TypeDeleteWarningDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type AttributeErrorFragment,
  AttributeTypeEnum,
  useAssignPageAttributeMutation,
  useAttributeCreateMutation,
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
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { type ReorderEvent } from "@dashboard/types";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { FormattedMessage, useIntl } from "react-intl";

import useAvailablePageAttributeSearch from "../../searches/useAvailablePageAttributesSearch";
import PageTypeDetailsPage, { type PageTypeForm } from "../components/PageTypeDetailsPage";
import { executePageTypeAttributeCreate } from "../handlers/pageTypeAttributeCreateHandler";
import usePageTypeDelete from "../hooks/usePageTypeDelete";
import { pageTypeListUrl, pageTypeUrl, type PageTypeUrlQueryParams } from "../urls";

interface PageTypeDetailsProps {
  id: string;
  params: PageTypeUrlQueryParams;
}

const PageTypeDetails = ({ id, params }: PageTypeDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const assignAttributesActions = useListSelectedItems<string>();
  const intl = useIntl();
  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage({ id: "GVGaij", defaultMessage: "Model type updated" }),
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
  const [assignCreatedAttribute, assignCreatedAttributeOpts] = useAssignPageAttributeMutation();
  const [attributeCreate, attributeCreateOpts] = useAttributeCreateMutation();
  const [unassignAttribute, unassignAttributeOpts] = useUnassignPageAttributeMutation({
    onCompleted: data => {
      if (data.pageAttributeUnassign.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "GVGaij", defaultMessage: "Model type updated" }),
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
  const handleCreateAttribute = async ({
    formData,
    values,
  }: AttributeCreateSubmitData): Promise<AttributeErrorFragment[]> => {
    const submitWithMetadata = createMetadataCreateHandler(
      async (data: AttributePageFormData) => {
        const outcome = await executePageTypeAttributeCreate(
          {
            pageTypeId: id,
            formData: data,
            values,
            createFailedMessage: intl.formatMessage(createAttributeMessages.createFailed),
            formatAssignErrors: errors =>
              errors.map(error => getPageErrorMessage(error, intl)).join(" "),
          },
          {
            attributeCreate,
            assignCreatedAttribute,
          },
        );

        if (outcome.assignErrorMessage) {
          notify({
            status: "error",
            text: outcome.assignErrorMessage,
          });
        }

        return outcome;
      },
      updateMetadata,
      updatePrivateMetadata,
      () => {
        notify({
          status: "success",
          text: intl.formatMessage(createAttributeMessages.createdAndAssigned),
        });
        closeModal();
      },
    );

    return (await submitWithMetadata(formData)) as AttributeErrorFragment[];
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
  const {
    data,
    loading: dataLoading,
    refetch,
  } = usePageTypeDetailsQuery({
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

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
        onAttributeCreate={() =>
          navigate(
            pageTypeUrl(id, {
              action: "create-attribute",
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
          <CreateAttributeDialog
            attributeType={AttributeTypeEnum.PAGE_TYPE}
            confirmButtonState={
              attributeCreateOpts.loading || assignCreatedAttributeOpts.loading
                ? "loading"
                : attributeCreateOpts.status
            }
            contextName={pageType.name}
            disabled={attributeCreateOpts.loading || assignCreatedAttributeOpts.loading}
            errors={attributeCreateOpts.data?.attributeCreate?.errors ?? []}
            open={params.action === "create-attribute"}
            onClose={closeModal}
            onSubmit={handleCreateAttribute}
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
