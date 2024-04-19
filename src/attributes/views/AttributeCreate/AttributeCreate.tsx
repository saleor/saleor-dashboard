import {
  AttributeCreateInput,
  AttributeErrorCode,
  AttributeErrorFragment,
  useAttributeCreateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPageInfo, { getMaxPage } from "@dashboard/hooks/useLocalPageInfo";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { ListViews, ReorderEvent } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { add, isSelected, move, remove, updateAtIndex } from "@dashboard/utils/lists";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributePage, { AttributePageFormData } from "../../components/AttributePage";
import AttributeValueDeleteDialog from "../../components/AttributeValueDeleteDialog";
import AttributeValueEditDialog from "../../components/AttributeValueEditDialog";
import {
  attributeAddUrl,
  AttributeAddUrlDialog,
  AttributeAddUrlQueryParams,
  attributeUrl,
} from "../../urls";
import { AttributeValueEditDialogFormData, getAttributeData } from "../../utils/data";

type ParamId = number | undefined;

interface AttributeDetailsProps {
  params: AttributeAddUrlQueryParams;
}

const attributeValueAlreadyExistsError: AttributeErrorFragment = {
  __typename: "AttributeError",
  code: AttributeErrorCode.ALREADY_EXISTS,
  field: "name",
  message: "",
};

function areValuesEqual(a: AttributeValueEditDialogFormData, b: AttributeValueEditDialogFormData) {
  return a.name === b.name;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [values, setValues] = React.useState<AttributeValueEditDialogFormData[]>([]);
  const [valueErrors, setValueErrors] = React.useState<AttributeErrorFragment[]>([]);
  const { updateListSettings, settings } = useListSettings(ListViews.ATTRIBUTE_VALUE_LIST);
  const { pageInfo, pageValues, loadNextPage, loadPreviousPage, loadPage } = useLocalPageInfo(
    values,
    settings?.rowNumber,
  );
  const [attributeCreate, attributeCreateOpts] = useAttributeCreateMutation({
    onCompleted: data => {
      if (data?.attributeCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "jTifz+",
            defaultMessage: "Successfully created attribute",
          }),
        });
        navigate(attributeUrl(data?.attributeCreate?.attribute?.id ?? ""));
      }
    },
  });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const id: ParamId = params.id ? parseInt(params.id, 10) + pageInfo.startCursor : undefined;
  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeAddUrlDialog,
    AttributeAddUrlQueryParams
  >(navigate, attributeAddUrl, params);

  React.useEffect(() => setValueErrors([]), [params.action]);

  const handleValueDelete = () => {
    if (id !== undefined) {
      const newValues = remove(values[id], values, areValuesEqual);

      setValues(newValues);
    }

    closeModal();
  };
  const handleValueUpdate = (input: AttributeValueEditDialogFormData) => {
    if (isSelected(input, values, areValuesEqual)) {
      setValueErrors([attributeValueAlreadyExistsError]);
    } else {
      if (id !== undefined) {
        setValues(updateAtIndex(input, values, id));
      }

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
        pageInfo.startCursor + newIndex,
      ),
    );
  const handleCreate = async (data: AttributePageFormData) => {
    const result = await attributeCreate({
      variables: {
        input: getAttributeData(data, values) as AttributeCreateInput,
      },
    });

    return {
      id: result.data?.attributeCreate?.attribute?.id ?? undefined,
      errors: getMutationErrors(result),
    };
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  return (
    <AttributePage
      attribute={null}
      disabled={attributeCreateOpts.loading}
      errors={attributeCreateOpts?.data?.attributeCreate?.errors || []}
      onDelete={() => undefined}
      onSubmit={handleSubmit}
      onValueAdd={() => openModal("add-value")}
      onValueDelete={id =>
        openModal("remove-value", {
          id,
        })
      }
      onValueReorder={handleValueReorder}
      onValueUpdate={id =>
        openModal("edit-value", {
          id,
        })
      }
      saveButtonBarState={attributeCreateOpts.status}
      values={{
        __typename: "AttributeValueCountableConnection" as const,
        pageInfo: {
          __typename: "PageInfo" as const,
          endCursor: "",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
        },
        edges: pageValues.map((value, valueIndex) => ({
          __typename: "AttributeValueCountableEdge" as const,
          cursor: "1",
          node: {
            __typename: "AttributeValue" as const,
            file: value?.fileUrl
              ? {
                  url: value.fileUrl,
                  contentType: value.contentType ?? "",
                  __typename: "File",
                }
              : null,
            id: valueIndex.toString(),
            reference: null,
            slug: slugify(value.name).toLowerCase(),
            sortOrder: valueIndex,
            value: null,
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
            ...value,
          },
        })),
      }}
      settings={settings}
      onUpdateListSettings={updateListSettings}
      pageInfo={pageInfo}
      onNextPage={loadNextPage}
      onPreviousPage={loadPreviousPage}
    >
      {data => (
        <>
          <AttributeValueEditDialog
            attributeValue={null}
            confirmButtonState="default"
            disabled={false}
            errors={valueErrors}
            open={params.action === "add-value"}
            onClose={closeModal}
            onSubmit={handleValueCreate}
            inputType={data.inputType}
          />
          {values.length > 0 && (
            <>
              <AttributeValueDeleteDialog
                attributeName=""
                open={params.action === "remove-value"}
                name={getStringOrPlaceholder(id !== undefined ? values[id]?.name : "")}
                confirmButtonState="default"
                onClose={closeModal}
                onConfirm={handleValueDelete}
              />
              <AttributeValueEditDialog
                inputType={data.inputType}
                attributeValue={id !== undefined ? values[id] : null}
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
      )}
    </AttributePage>
  );
};

AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
