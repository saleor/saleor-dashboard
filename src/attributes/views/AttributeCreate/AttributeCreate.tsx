import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getStringOrPlaceholder } from "@saleor/misc";
import { ReorderEvent } from "@saleor/types";
import {
  AttributeErrorCode,
  AttributeInputTypeEnum
} from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  add,
  isSelected,
  move,
  remove,
  updateAtIndex
} from "@saleor/utils/lists";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributePage, {
  AttributePageFormData
} from "../../components/AttributePage";
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

const attributeValueAlreadyExistsError: AttributeErrorFragment = {
  __typename: "AttributeError",
  code: AttributeErrorCode.ALREADY_EXISTS,
  field: "name"
};

function areValuesEqual(
  a: AttributeValueEditDialogFormData,
  b: AttributeValueEditDialogFormData
) {
  return a.name === b.name;
}

function getSimpleAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[]
) {
  return {
    ...data,
    metadata: undefined,
    privateMetadata: undefined,
    storefrontSearchPosition: parseInt(data.storefrontSearchPosition, 10),
    values: values.map(value => ({
      name: value.name
    }))
  };
}

function getFileAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[]
) {
  return {
    ...getSimpleAttributeData(data, values),
    availableInGrid: undefined,
    filterableInDashboard: undefined,
    filterableInStorefront: undefined
  };
}

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [values, setValues] = React.useState<
    AttributeValueEditDialogFormData[]
  >([]);
  const [valueErrors, setValueErrors] = React.useState<
    AttributeErrorFragment[]
  >([]);

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
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

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

  const handleCreate = async (data: AttributePageFormData) => {
    const input =
      data.inputType === AttributeInputTypeEnum.FILE
        ? getFileAttributeData(data, values)
        : getSimpleAttributeData(data, values);

    const result = await attributeCreate({
      variables: {
        input
      }
    });

    return result.data.attributeCreate?.attribute?.id || null;
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );

  return (
    <>
      <AttributePage
        attribute={null}
        disabled={attributeCreateOpts.loading}
        errors={attributeCreateOpts.data?.attributeCreate.errors || []}
        onBack={() => navigate(attributeListUrl())}
        onDelete={undefined}
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
        saveButtonBarState={attributeCreateOpts.status}
        values={values.map((value, valueIndex) => ({
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: valueIndex.toString(),
          slug: slugify(value.name).toLowerCase(),
          sortOrder: valueIndex,
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
            name={getStringOrPlaceholder(values[id]?.name)}
            confirmButtonState="default"
            onClose={closeModal}
            onConfirm={handleValueDelete}
          />
          <AttributeValueEditDialog
            attributeValue={values[params.id]}
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
