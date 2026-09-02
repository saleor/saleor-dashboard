// @ts-strict-ignore
import { AssignedAttributesBulkDeleteButton } from "@dashboard/attributes/components/AssignedAttributesCard/AssignedAttributesBulkDeleteButton";
import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage/AttributePage";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import AssignAttributeDialog from "@dashboard/components/AssignAttributeDialog/AssignAttributeDialog";
import { AttributeUnassignDialog } from "@dashboard/components/AttributeUnassignDialog/AttributeUnassignDialog";
import { usePendingAttributeUnassign } from "@dashboard/components/AttributeUnassignDialog/usePendingAttributeUnassign";
import { BulkAttributeUnassignDialog } from "@dashboard/components/BulkAttributeUnassignDialog/BulkAttributeUnassignDialog";
import {
  type AttributeCreateSubmitData,
  CreateAttributeDialog,
} from "@dashboard/components/CreateAttributeDialog/CreateAttributeDialog";
import { messages as createAttributeMessages } from "@dashboard/components/CreateAttributeDialog/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { type CustomerTypeForm } from "@dashboard/customerTypes/components/CustomerTypeDetailsPage/CustomerTypeDetailsPage";
import { CustomerTypeDetailsPage } from "@dashboard/customerTypes/components/CustomerTypeDetailsPage/CustomerTypeDetailsPage";
import { CustomerTypeMetadataDialog } from "@dashboard/customerTypes/components/CustomerTypeMetadataDialog/CustomerTypeMetadataDialog";
import { executeCustomerTypeAttributeCreate } from "@dashboard/customerTypes/handlers/customerTypeAttributeCreateHandler";
import { useCustomerTypeDelete } from "@dashboard/customerTypes/hooks/useCustomerTypeDelete";
import {
  customerTypeListUrl,
  customerTypeUrl,
  type CustomerTypeUrlDialog,
  type CustomerTypeUrlQueryParams,
} from "@dashboard/customerTypes/urls";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type AttributeErrorFragment,
  AttributeTypeEnum,
  useAttributeCreateMutation,
  useCustomerTypeAssignAttributesMutation,
  useCustomerTypeDeleteMutation,
  useCustomerTypeDetailsQuery,
  useCustomerTypeReorderAttributesMutation,
  useCustomerTypeUnassignAttributesMutation,
  useCustomerTypeUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import { useListSelectedItems } from "@dashboard/hooks/useListSelectedItems";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { type ReorderEvent } from "@dashboard/types";
import getCustomerTypeErrorMessage from "@dashboard/utils/errors/customerType";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { FormattedMessage, useIntl } from "react-intl";

import useAvailableCustomerAttributeSearch from "../../searches/useAvailableCustomerAttributesSearch";

interface CustomerTypeDetailsProps {
  id: string;
  params: CustomerTypeUrlQueryParams;
}

const CustomerTypeDetails = ({ id, params }: CustomerTypeDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const attributeListActions = useBulkActions();
  const assignAttributesActions = useListSelectedItems<string>();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerTypeUrlDialog,
    CustomerTypeUrlQueryParams
  >(navigate, dialogParams => customerTypeUrl(id, dialogParams), params);
  const pendingUnassign = usePendingAttributeUnassign(params.id);
  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage({ id: "rHRoia", defaultMessage: "Customer type updated" }),
    });
  const notifyUnexpectedError = () =>
    notify({
      status: "error",
      text: intl.formatMessage(commonMessages.somethingWentWrong),
    });
  const [updateCustomerType, updateCustomerTypeOpts] = useCustomerTypeUpdateMutation({
    disableErrorHandling: true,
    onCompleted: updateData => {
      if (
        !updateData.customerTypeUpdate.errors ||
        updateData.customerTypeUpdate.errors.length === 0
      ) {
        notifySaved();
      }
    },
    // Field errors render inline on the form; anything else would otherwise fail silently.
    onError: notifyUnexpectedError,
  });
  const [setDefaultCustomerType, setDefaultCustomerTypeOpts] = useCustomerTypeUpdateMutation({
    disableErrorHandling: true,
    onCompleted: updateData => {
      const errors = updateData.customerTypeUpdate.errors ?? [];

      if (errors.length > 0) {
        notify({
          status: "error",
          text: getCustomerTypeErrorMessage(errors[0], intl),
        });

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(
          {
            id: "OjxWjG",
            defaultMessage: "{name} is now the default customer type",
          },
          { name: updateData.customerTypeUpdate.customerType?.name },
        ),
      });
    },
    onError: notifyUnexpectedError,
  });
  const [deleteCustomerType, deleteCustomerTypeOpts] = useCustomerTypeDeleteMutation({
    onCompleted: deleteData => {
      if (deleteData.customerTypeDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "g2VphM",
            defaultMessage: "Customer type deleted",
          }),
        });
        navigate(customerTypeListUrl(), { replace: true });
      }
    },
  });
  const [assignAttribute, assignAttributeOpts] = useCustomerTypeAssignAttributesMutation({
    onCompleted: data => {
      if (data.customerTypeAssignAttributes.errors.length === 0) {
        notifySaved();
        closeModal();
      }
    },
  });
  const [assignCreatedAttribute, assignCreatedAttributeOpts] =
    useCustomerTypeAssignAttributesMutation();
  const [attributeCreate, attributeCreateOpts] = useAttributeCreateMutation();
  const [unassignAttribute, unassignAttributeOpts] = useCustomerTypeUnassignAttributesMutation({
    onCompleted: data => {
      if (data.customerTypeUnassignAttributes.errors.length === 0) {
        notifySaved();
        pendingUnassign.clear();
        closeModal();
        attributeListActions.reset();
      }
    },
  });
  const [reorderAttribute] = useCustomerTypeReorderAttributesMutation({
    onCompleted: data => {
      if (data.customerTypeReorderAttributes.errors.length === 0) {
        notifySaved();
      }
    },
  });
  const customerTypeDeleteData = useCustomerTypeDelete({
    id,
    params,
  });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const handleCustomerTypeUpdate = async (formData: CustomerTypeForm) => {
    const result = await updateCustomerType({
      variables: {
        id,
        input: {
          name: formData.name,
          slug: formData.slug,
        },
      },
    });

    return getMutationErrors(result);
  };
  const handleCustomerTypeDelete = () => deleteCustomerType({ variables: { id } });
  const handleSetDefault = () =>
    setDefaultCustomerType({
      variables: {
        id,
        input: {
          isDefault: true,
        },
      },
    });
  const handleAssignAttribute = async () => {
    const result = await assignAttribute({
      variables: {
        customerTypeId: id,
        attributeIds: assignAttributesActions.selectedItems,
      },
    });

    // Keep the picks when the assign fails, so the user doesn't have to find them again.
    if (getMutationErrors(result).length === 0) {
      assignAttributesActions.clearSelectedItems();
    }
  };
  const handleCreateAttribute = async ({
    formData,
    values,
  }: AttributeCreateSubmitData): Promise<AttributeErrorFragment[]> => {
    const submitWithMetadata = createMetadataCreateHandler(
      async (data: AttributePageFormData) => {
        const outcome = await executeCustomerTypeAttributeCreate(
          {
            customerTypeId: id,
            formData: data,
            values,
            createFailedMessage: intl.formatMessage(createAttributeMessages.createFailed),
            formatAssignErrors: errors =>
              errors.map(error => getCustomerTypeErrorMessage(error, intl)).join(" "),
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
  const handleAttributeUnassign = () => {
    const attributeId = pendingUnassign.takeAttributeId();

    if (!attributeId) {
      return;
    }

    unassignAttribute({
      variables: {
        customerTypeId: id,
        attributeIds: [attributeId],
      },
    });
  };
  const handleBulkAttributeUnassign = () => {
    const ids = attributeListActions.listElements.filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    unassignAttribute({
      variables: {
        customerTypeId: id,
        attributeIds: ids,
      },
    });
  };
  const handleAttributeReorder = (event: ReorderEvent) =>
    reorderAttribute({
      variables: {
        move: {
          id: data.customerType.attributes[event.oldIndex].id,
          sortOrder: event.newIndex - event.oldIndex,
        },
        customerTypeId: id,
      },
    });
  const {
    data,
    loading: dataLoading,
    refetch,
  } = useCustomerTypeDetailsQuery({
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

  const { loadMore, search, result } = useAvailableCustomerAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      id,
    },
  });
  const customerType = data?.customerType;

  if (customerType === null) {
    return <NotFoundPage backHref={customerTypeListUrl()} />;
  }

  const loading =
    updateCustomerTypeOpts.loading || setDefaultCustomerTypeOpts.loading || dataLoading;

  return (
    <>
      <WindowTitle title={data?.customerType.name} />
      <CustomerTypeDetailsPage
        disabled={loading}
        errors={updateCustomerTypeOpts.data?.customerTypeUpdate.errors ?? []}
        customerType={data?.customerType}
        saveButtonBarState={updateCustomerTypeOpts.status}
        onAttributeAdd={type =>
          openModal("assign-attribute", {
            type,
          })
        }
        onAttributeCreate={() => openModal("create-attribute")}
        onAttributeReorder={handleAttributeReorder}
        onAttributeUnassign={attributeId => {
          if (!pendingUnassign.beginUnassign(attributeId)) {
            return;
          }

          openModal("unassign-attribute", {
            id: attributeId,
          });
        }}
        onDelete={() => openModal("remove")}
        onSetDefault={handleSetDefault}
        onShowMetadata={() => openModal("view-metadata", { id: undefined })}
        onSubmit={handleCustomerTypeUpdate}
        attributeList={{
          isChecked: attributeListActions.isSelected,
          selected: attributeListActions.listElements.length,
          toggle: attributeListActions.toggle,
          toggleAll: attributeListActions.toggleAll,
          toolbar: (
            <AssignedAttributesBulkDeleteButton
              onClick={() => openModal("unassign-attributes")}
              label={intl.formatMessage({
                id: "tqcnG1",
                defaultMessage: "Unassign",
                description: "unassign attribute from customer type, button",
              })}
            />
          ),
        }}
      />

      {customerType && (
        <>
          <CustomerTypeMetadataDialog
            open={params.action === "view-metadata" && !!customerType}
            onClose={closeModal}
            customerType={customerType}
            refetchCustomerType={refetch}
          />
          <ActionDialog
            open={customerTypeDeleteData.isOpen && !customerType.isDefault}
            confirmButtonState={deleteCustomerTypeOpts.status}
            onClose={closeModal}
            onConfirm={handleCustomerTypeDelete}
            variant="delete"
            title={intl.formatMessage({
              id: "uKuQFH",
              defaultMessage: "Delete customer type",
              description: "delete customer type dialog title",
            })}
          >
            {customerTypeDeleteData.canCountCustomers &&
            typeof customerTypeDeleteData.assignedCustomersCount === "number" ? (
              <FormattedMessage
                id="q+SBuc"
                defaultMessage="Deleting this customer type will reassign {count} {count, plural, one {customer} other {customers}} to the default customer type."
                values={{ count: customerTypeDeleteData.assignedCustomersCount }}
              />
            ) : (
              <FormattedMessage
                id="JZ3Liu"
                defaultMessage="Deleting this customer type will reassign its customers to the default customer type."
              />
            )}
          </ActionDialog>
          <AssignAttributeDialog
            attributes={mapEdgesToItems(result?.data?.customerType?.availableAttributes)}
            confirmButtonState={assignAttributeOpts.status}
            errors={
              assignAttributeOpts.data?.customerTypeAssignAttributes.errors
                ? assignAttributeOpts.data.customerTypeAssignAttributes.errors.map(err =>
                    getCustomerTypeErrorMessage(err, intl),
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
            hasMore={!!result.data?.customerType.availableAttributes.pageInfo.hasNextPage}
            open={params.action === "assign-attribute"}
            selected={assignAttributesActions.selectedItems}
            onToggle={assignAttributesActions.toggleSelectItem}
          />
          <CreateAttributeDialog
            attributeType={AttributeTypeEnum.CUSTOMER_TYPE}
            confirmButtonState={
              attributeCreateOpts.loading || assignCreatedAttributeOpts.loading
                ? "loading"
                : attributeCreateOpts.status
            }
            contextName={customerType.name}
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
          id: "6tlOZ8",
          defaultMessage: "Unassign attribute from customer type",
          description: "dialog header",
        })}
        attributeQuantity={attributeListActions.listElements.length}
        confirmButtonState={unassignAttributeOpts.status}
        onClose={closeModal}
        onConfirm={handleBulkAttributeUnassign}
        open={params.action === "unassign-attributes"}
        itemTypeName={getStringOrPlaceholder(data?.customerType.name)}
      />
      <AttributeUnassignDialog
        title={intl.formatMessage({
          id: "6tlOZ8",
          defaultMessage: "Unassign attribute from customer type",
          description: "dialog header",
        })}
        attributeName={getStringOrPlaceholder(
          data?.customerType.attributes.find(
            attribute => attribute.id === pendingUnassign.attributeId,
          )?.name,
        )}
        confirmButtonState={unassignAttributeOpts.status}
        onClose={closeModal}
        onConfirm={handleAttributeUnassign}
        open={params.action === "unassign-attribute"}
        itemTypeName={getStringOrPlaceholder(data?.customerType.name)}
      />
    </>
  );
};

export default CustomerTypeDetails;
