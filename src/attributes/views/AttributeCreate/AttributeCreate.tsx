import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "@saleor/misc";
import { ReorderEvent } from "@saleor/types";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import {
  add,
  isSelected,
  move,
  remove,
  updateAtIndex
} from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributePage from "../../components/AttributePage";
import AttributeValueDeleteDialog from "../../components/AttributeValueDeleteDialog";
import AttributeValueEditDialog, {
  AttributeValueEditDialogFormData
} from "../../components/AttributeValueEditDialog";
import { useAttributeCreateMutation } from "../../mutations";
import {
  attributeAddUrl,
  AttributeAddUrlDialog,
  AttributeAddUrlQueryParams,
  attributeListUrl,
  attributeUrl
} from "../../urls";

interface AttributeDetailsProps {
  params: AttributeAddUrlQueryParams;
}

const attributeValueAlreadyExistsError: ProductErrorFragment = {
  __typename: "ProductError",
  code: ProductErrorCode.ALREADY_EXISTS,
  field: "name"
};

function areValuesEqual(
  a: AttributeValueEditDialogFormData,
  b: AttributeValueEditDialogFormData
) {
  return a.name === b.name;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [values, setValues] = React.useState<
    AttributeValueEditDialogFormData[]
  >([]);
  const [valueErrors, setValueErrors] = React.useState<ProductErrorFragment[]>(
    []
  );

  const [attributeCreate, attributeCreateOpts] = useAttributeCreateMutation({
    onCompleted: data => {
      if (data.attributeCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Successfully created attribute"
          })
        });
        navigate(attributeUrl(data.attributeCreate.attribute.id));
      }
    }
  });

  const id = params.id ? parseInt(params.id, 0) : undefined;

  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeAddUrlDialog,
    AttributeAddUrlQueryParams
  >(navigate, attributeAddUrl, params);

  React.useEffect(() => setValueErrors([]), [params.action]);

  const handleValueDelete = () => {
    setValues(remove(values[params.id], values, areValuesEqual));
    closeModal();
  };
  const handleValueUpdate = (input: AttributeValueEditDialogFormData) => {
    if (isSelected(input, values, areValuesEqual)) {
      setValueErrors([attributeValueAlreadyExistsError]);
    } else {
      setValues(updateAtIndex(input, values, id));
      closeModal();
    }
  };
  const handleValueCreate = (input: AttributeValueEditDialogFormData) => {
    if (isSelected(input, values, areValuesEqual)) {
      setValueErrors([attributeValueAlreadyExistsError]);
    } else {
      setValues(add(input, values));
      closeModal();
    }
  };
  const handleValueReorder = ({ newIndex, oldIndex }: ReorderEvent) =>
    setValues(move(values[oldIndex], values, areValuesEqual, newIndex));

  return (
    <>
      <AttributePage
        attribute={null}
        disabled={false}
        errors={attributeCreateOpts.data?.attributeCreate.errors || []}
        onBack={() => navigate(attributeListUrl())}
        onDelete={undefined}
        onSubmit={input =>
          attributeCreate({
            variables: {
              input: {
                ...input,
                storefrontSearchPosition: parseInt(
                  input.storefrontSearchPosition,
                  0
                ),
                values: values.map(value => ({
                  name: value.name
                }))
              }
            }
          })
        }
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
        saveButtonBarState={attributeCreateOpts.status}
        values={values.map((value, valueIndex) => ({
          __typename: "AttributeValue" as "AttributeValue",
          id: valueIndex.toString(),
          slug: slugify(value.name).toLowerCase(),
          sortOrder: valueIndex,
          type: null,
          value: null,
          ...value
        }))}
      />
      <AttributeValueEditDialog
        attributeValue={null}
        confirmButtonState="default"
        disabled={false}
        errors={valueErrors}
        open={params.action === "add-value"}
        onClose={closeModal}
        onSubmit={handleValueCreate}
      />
      {values.length > 0 && (
        <>
          <AttributeValueDeleteDialog
            attributeName={undefined}
            open={params.action === "remove-value"}
            name={maybe(() => values[id].name, "...")}
            confirmButtonState="default"
            onClose={closeModal}
            onConfirm={handleValueDelete}
          />
          <AttributeValueEditDialog
            attributeValue={maybe(() => values[params.id])}
            confirmButtonState="default"
            disabled={false}
            errors={valueErrors}
            open={params.action === "edit-value"}
            onClose={closeModal}
            onSubmit={handleValueUpdate}
          />
        </>
      )}
    </>
  );
};
AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
