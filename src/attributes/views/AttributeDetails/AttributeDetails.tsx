import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ReorderEvent } from "@saleor/types";
import { getProductErrorMessage } from "@saleor/utils/errors";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { move } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

import AttributeDeleteDialog from "../../components/AttributeDeleteDialog";
import AttributePage from "../../components/AttributePage";
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
  const notify = useNotifier();
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeUrlDialog,
    AttributeUrlQueryParams
  >(navigate, params => attributeUrl(id, params), params);

  const { data, loading } = useAttributeDetailsQuery({
    variables: {
      id
    }
  });

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
          text: getProductErrorMessage(
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
            values: move(
              data.attribute.values[oldIndex],
              data.attribute.values,
              (a, b) => a.id === b.id,
              newIndex
            )
          },
          errors: []
        }
      },
      variables: {
        id,
        move: {
          id: data.attribute.values[oldIndex].id,
          sortOrder: newIndex - oldIndex
        }
      }
    });

  return (
    <>
      <AttributePage
        attribute={maybe(() => data.attribute)}
        disabled={loading}
        errors={attributeUpdateOpts.data?.attributeUpdate.errors || []}
        onBack={() => navigate(attributeListUrl())}
        onDelete={() => openModal("remove")}
        onSubmit={data => {
          const input = {
            ...data,
            inputType: undefined
          };

          attributeUpdate({
            variables: {
              id,
              input: {
                ...input,
                storefrontSearchPosition: parseInt(
                  input.storefrontSearchPosition,
                  0
                )
              }
            }
          });
        }}
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
            data.attribute.values.find(value => params.id === value.id).name,
          "..."
        )}
        useName={true}
        confirmButtonState={attributeValueDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          attributeValueDelete({
            variables: {
              id: params.id
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
              input
            }
          })
        }
      />
      <AttributeValueEditDialog
        attributeValue={maybe(() =>
          data.attribute.values.find(value => params.id === value.id)
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
              id: data.attribute.values.find(value => params.id === value.id)
                .id,
              input
            }
          })
        }
      />
    </>
  );
};
AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
