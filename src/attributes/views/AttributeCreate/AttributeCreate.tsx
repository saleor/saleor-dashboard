import { getAttributeData } from "@saleor/attributes/utils/data";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import useListSettings from "@saleor/hooks/useListSettings";
import useLocalPageInfo, { getMaxPage } from "@saleor/hooks/useLocalPageInfo";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getStringOrPlaceholder } from "@saleor/misc";
import { ListViews, ReorderEvent } from "@saleor/types";
import { AttributeErrorCode } from "@saleor/types/globalTypes";
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

  const { updateListSettings, settings } = useListSettings(
    ListViews.ATTRIBUTE_VALUE_LIST
  );

  const {
    pageInfo,
    pageValues,
    loadNextPage,
    loadPreviousPage,
    loadPage
  } = useLocalPageInfo(values, settings?.rowNumber);

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

  const id = params.id
    ? parseInt(params.id, 0) + pageInfo.startCursor
    : undefined;

  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeAddUrlDialog,
    AttributeAddUrlQueryParams
  >(navigate, attributeAddUrl, params);

  React.useEffect(() => setValueErrors([]), [params.action]);

  const handleValueDelete = () => {
    const newValues = remove(values[id], values, areValuesEqual);
    setValues(newValues);
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
      const newValues = add(input, values);
      setValues(newValues);
      const addedToNotVisibleLastPage =
        newValues.length - pageInfo.startCursor > settings.rowNumber;
      if (addedToNotVisibleLastPage) {
        const maxPage = getMaxPage(newValues.length, settings.rowNumber);
        loadPage(maxPage);
      }
      closeModal();
    }
  };
  const handleValueReorder = ({ newIndex, oldIndex }: ReorderEvent) =>
    setValues(
      move(
        values[pageInfo.startCursor + oldIndex],
        values,
        areValuesEqual,
        pageInfo.startCursor + newIndex
      )
    );

  const handleCreate = async (data: AttributePageFormData) => {
    const input = getAttributeData(data, values);

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
        values={{
          __typename: "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
          pageInfo: {
            __typename: "PageInfo" as "PageInfo",
            endCursor: "",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: ""
          },
          edges: pageValues.map((value, valueIndex) => ({
            __typename: "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
            cursor: "1",
            node: {
              __typename: "AttributeValue" as "AttributeValue",
              file: null,
              id: valueIndex.toString(),
              reference: null,
              slug: slugify(value.name).toLowerCase(),
              sortOrder: valueIndex,
              value: null,
              richText: null,
              boolean: null,
              ...value
            }
          }))
        }}
        settings={settings}
        onUpdateListSettings={updateListSettings}
        pageInfo={pageInfo}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
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
            attributeValue={values[id]}
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
