import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews, ReorderEvent } from "@saleor/types";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { move } from "@saleor/utils/lists";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import AttributeDeleteDialog from "../../components/AttributeDeleteDialog";
import AttributePage, {
  AttributePageFormData
} from "../../components/AttributePage";
import AttributeValueDeleteDialog from "../../components/AttributeValueDeleteDialog";
import AttributeValueEditDialog from "../../components/AttributeValueEditDialog";
import {
  useAttributeDeleteMutation,
  useAttributeUpdateMutation,
  useAttributeValueCreateMutation,
  useAttributeValueDeleteMutation,
  useAttributeValueReorderMutation,
  useAttributeValueUpdateMutation
} from "../../mutations";
import { useAttributeDetailsQuery } from "../../queries";
import {
  attributeListUrl,
  attributeUrl,
  AttributeUrlDialog,
  AttributeUrlQueryParams
} from "../../urls";

interface AttributeDetailsProps {
  id: string;
  params: AttributeUrlQueryParams;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeUrlDialog,
    AttributeUrlQueryParams
  >(navigate, params => attributeUrl(id, params), params);

  const { updateListSettings, settings } = useListSettings(
    ListViews.ATTRIBUTE_VALUE_LIST
  );

  const { data, loading } = useAttributeDetailsQuery({
    variables: {
      id,
      firstValues: settings?.rowNumber,
      afterValues: params.after
    },
    skip: !settings
  });

  const paginationState = createPaginationState(settings?.rowNumber, params);
  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.attribute?.values?.pageInfo,
    paginationState,
    params
  );

  const [attributeDelete, attributeDeleteOpts] = useAttributeDeleteMutation({
    onCompleted: data => {
      if (data.attributeDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Attribute deleted"
          })
        });
        navigate(attributeListUrl());
      }
    }
  });

  const [
    attributeValueDelete,
    attributeValueDeleteOpts
  ] = useAttributeValueDeleteMutation({
    onCompleted: data => {
      if (data.attributeValueDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Value deleted",
            description: "attribute value deleted"
          })
        });
        closeModal();
      }
    }
  });

  const [
    attributeValueUpdate,
    attributeValueUpdateOpts
  ] = useAttributeValueUpdateMutation({
    onCompleted: data => {
      if (data.attributeValueUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [attributeUpdate, attributeUpdateOpts] = useAttributeUpdateMutation({
    onCompleted: data => {
      if (data.attributeUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const [
    attributeValueCreate,
    attributeValueCreateOpts
  ] = useAttributeValueCreateMutation({
    onCompleted: data => {
      if (data.attributeValueCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Added new value",
            description: "added new attribute value"
          })
        });
        closeModal();
      }
    }
  });

  const [attributeValueReorder] = useAttributeValueReorderMutation({
    onCompleted: data => {
      if (data.attributeReorderValues.errors.length !== 0) {
        notify({
          status: "error",
          text: getAttributeErrorMessage(
            data.attributeReorderValues.errors[0],
            intl
          )
        });
      }
    }
  });

  const handleValueReorder = ({ newIndex, oldIndex }: ReorderEvent) =>
    attributeValueReorder({
      optimisticResponse: {
        attributeReorderValues: {
          __typename: "AttributeReorderValues",
          attribute: {
            ...data.attribute,
            values: {
              __typename: "AttributeValueCountableConnection",
              pageInfo: {
                ...data.attribute.values.pageInfo
              },
              edges: move(
                data.attribute.values.edges[oldIndex],
                data.attribute.values.edges,
                (a, b) => a.node.id === b.node.id,
                newIndex
              )
            }
          },
          errors: []
        }
      },
      variables: {
        id,
        move: {
          id: data.attribute.values.edges[oldIndex].node.id,
          sortOrder: newIndex - oldIndex
        },
        firstValues: settings.rowNumber,
        afterValues: params.after
      }
    });

  const handleUpdate = async (data: AttributePageFormData) => {
    const input = {
      ...data,
      entityType: undefined,
      inputType: undefined,
      metadata: undefined,
      privateMetadata: undefined,
      storefrontSearchPosition: parseInt(data.storefrontSearchPosition, 0)
    };

    const result = await attributeUpdate({
      variables: {
        id,
        input
      }
    });

    return result.data.attributeUpdate.errors;
  };

  const handleSubmit = createMetadataUpdateHandler(
    data?.attribute,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  return (
    <>
      <AttributePage
        attribute={maybe(() => data.attribute)}
        disabled={loading}
        errors={attributeUpdateOpts.data?.attributeUpdate.errors || []}
        onBack={() => navigate(attributeListUrl())}
        onDelete={() => openModal("remove")}
        onSubmit={handleSubmit}
        onValueAdd={() => openModal("add-value")}
        onValueDelete={id =>
          openModal("remove-value", {
            id
          })
        }
        onValueReorder={handleValueReorder}
        onValueUpdate={id =>
          openModal("edit-value", {
            id
          })
        }
        saveButtonBarState={attributeUpdateOpts.status}
        values={maybe(() => data.attribute.values)}
        settings={settings}
        onUpdateListSettings={updateListSettings}
        pageInfo={pageInfo}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
      />
      <AttributeDeleteDialog
        open={params.action === "remove"}
        name={maybe(() => data.attribute.name, "...")}
        confirmButtonState={attributeDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          attributeDelete({
            variables: {
              id
            }
          })
        }
      />
      <AttributeValueDeleteDialog
        attributeName={maybe(() => data.attribute.name, "...")}
        open={params.action === "remove-value"}
        name={maybe(
          () =>
            data.attribute.values.edges.find(
              value => params.id === value.node.id
            ).node.name,
          "..."
        )}
        useName={true}
        confirmButtonState={attributeValueDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          attributeValueDelete({
            variables: {
              id: params.id,
              firstValues: settings.rowNumber,
              afterValues: params.after
            }
          })
        }
      />
      <AttributeValueEditDialog
        attributeValue={null}
        confirmButtonState={attributeValueCreateOpts.status}
        disabled={loading}
        errors={
          attributeValueCreateOpts.data?.attributeValueCreate.errors || []
        }
        open={params.action === "add-value"}
        onClose={closeModal}
        onSubmit={input =>
          attributeValueCreate({
            variables: {
              id,
              input,
              firstValues: settings.rowNumber,
              afterValues: params.after
            }
          })
        }
      />
      <AttributeValueEditDialog
        attributeValue={maybe(
          () =>
            data.attribute.values.edges.find(
              value => params.id === value.node.id
            ).node
        )}
        confirmButtonState={attributeValueUpdateOpts.status}
        disabled={loading}
        errors={
          attributeValueUpdateOpts.data?.attributeValueUpdate.errors || []
        }
        open={params.action === "edit-value"}
        onClose={closeModal}
        onSubmit={input =>
          attributeValueUpdate({
            variables: {
              id: data.attribute.values.edges.find(
                value => params.id === value.node.id
              ).node.id,
              input,
              firstValues: settings.rowNumber,
              afterValues: params.after
            }
          })
        }
      />
    </>
  );
};
AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
