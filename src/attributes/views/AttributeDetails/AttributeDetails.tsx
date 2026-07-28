import { type AttributeAssignedTypesCardProps } from "@dashboard/attributes/components/AttributeAssignedTypesCard/AttributeAssignedTypesCard";
import { useAttributeValuesSearch } from "@dashboard/attributes/hooks/useAttributeValuesSearch";
import { attributeValueFragmentToFormData } from "@dashboard/attributes/utils/data";
import { getAssignedModelTypesForAttribute } from "@dashboard/attributes/utils/getAssignedModelTypesForAttribute";
import { mapAssignedTypeConnection } from "@dashboard/attributes/utils/mapAssignedTypeConnection";
import {
  AttributeTypeEnum,
  OrderDirection,
  PageTypeSortField,
  useAttributeDeleteMutation,
  useAttributeDetailsQuery,
  useAttributeUpdateMutation,
  useAttributeValueCreateMutation,
  useAttributeValueDeleteMutation,
  useAttributeValueReorderMutation,
  useAttributeValueUpdateMutation,
  usePageTypeListWithAssignedAttributeCountsQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import { ListViews, type ReorderEvent } from "@dashboard/types";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { move } from "@dashboard/utils/lists";
import omit from "lodash/omit";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { AttributeDeleteDialog } from "../../components/AttributeDeleteDialog";
import { AttributeMetadataDialog } from "../../components/AttributeMetadataDialog/AttributeMetadataDialog";
import AttributePage, { type AttributePageFormData } from "../../components/AttributePage";
import { AttributeValueDeleteDialog } from "../../components/AttributeValueDeleteDialog";
import { AttributeValueEditDialog } from "../../components/AttributeValueEditDialog/AttributeValueEditDialog";
import {
  attributeListUrl,
  attributeUrl,
  type AttributeUrlDialog,
  type AttributeUrlQueryParams,
} from "../../urls";

interface AttributeDetailsProps {
  id: string;
  params: AttributeUrlQueryParams;
}

const AttributeDetails = ({ id, params }: AttributeDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    AttributeUrlDialog,
    AttributeUrlQueryParams
  >(navigate, params => attributeUrl(id, params), params);
  const { updateListSettings, settings } = useListSettings(ListViews.ATTRIBUTE_VALUE_LIST);
  const [valuesPaginationState, setValuesPaginationState] = useLocalPaginationState(
    settings?.rowNumber,
  );

  const resetPagination = useCallback(() => {
    setValuesPaginationState({
      first: settings?.rowNumber,
      after: undefined,
      last: undefined,
      before: undefined,
    });
  }, [settings?.rowNumber, setValuesPaginationState]);

  const { searchQuery, debouncedSearchQuery, handleSearchChange } = useAttributeValuesSearch({
    onResetPagination: resetPagination,
  });

  const {
    data: currentData,
    previousData,
    loading,
    refetch,
  } = useAttributeDetailsQuery({
    variables: {
      id,
      firstValues: valuesPaginationState.first,
      lastValues: valuesPaginationState.last,
      afterValues: valuesPaginationState.after,
      beforeValues: valuesPaginationState.before,
      searchValues: debouncedSearchQuery || undefined,
    },
    skip: !settings,
  });

  // Use previous data while loading to prevent UI flicker during search/pagination
  const data = currentData ?? previousData;

  // Only show as "loading" for initial load, not for search refetches
  const isInitialLoading = loading && !data;
  const attribute = data?.attribute;
  const isModelAttribute = attribute?.type === AttributeTypeEnum.PAGE_TYPE;
  const isProductAttribute = attribute?.type === AttributeTypeEnum.PRODUCT_TYPE;

  const { data: pageTypesData, loading: pageTypesLoading } =
    usePageTypeListWithAssignedAttributeCountsQuery({
      fetchPolicy: "cache-first",
      skip: !isModelAttribute,
      variables: {
        first: 100,
        sort: { field: PageTypeSortField.NAME, direction: OrderDirection.ASC },
      },
    });

  const assignedTypes = useMemo((): AttributeAssignedTypesCardProps | undefined => {
    if (!attribute) {
      return undefined;
    }

    if (isProductAttribute) {
      return {
        attributeType: AttributeTypeEnum.PRODUCT_TYPE,
        loading: false,
        productTypes: mapAssignedTypeConnection(attribute.productTypes),
        variantTypes: mapAssignedTypeConnection(attribute.productVariantTypes),
      };
    }

    if (isModelAttribute) {
      const modelTypes = getAssignedModelTypesForAttribute(pageTypesData, id);

      return {
        attributeType: AttributeTypeEnum.PAGE_TYPE,
        loading: pageTypesLoading && !pageTypesData,
        modelTypes: {
          items: modelTypes.items,
          hasMore: false,
        },
        modelTypesListHasMore: modelTypes.typesListHasMore,
      };
    }

    return undefined;
  }, [attribute, id, isModelAttribute, isProductAttribute, pageTypesData, pageTypesLoading]);

  const paginateValues = useLocalPaginator(setValuesPaginationState);
  const { loadNextPage, loadPreviousPage, pageInfo } = paginateValues(
    data?.attribute?.choices?.pageInfo,
    valuesPaginationState,
  );
  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage({ id: "s8e+7y", defaultMessage: "Attribute updated" }),
    });
  const [attributeDelete, attributeDeleteOpts] = useAttributeDeleteMutation({
    onCompleted: data => {
      if (data?.attributeDelete?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "V/VAHG",
            defaultMessage: "Attribute deleted",
          }),
        });
        navigate(attributeListUrl());
      }
    },
  });
  const [attributeValueDelete, attributeValueDeleteOpts] = useAttributeValueDeleteMutation({
    onCompleted: data => {
      if (data?.attributeValueDelete?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "7H2D5m",
            defaultMessage: "Value deleted",
            description: "attribute value deleted",
          }),
        });
        closeModal();
      }
    },
  });
  const [attributeValueUpdate, attributeValueUpdateOpts] = useAttributeValueUpdateMutation({
    onCompleted: data => {
      if (data?.attributeValueUpdate?.errors.length === 0) {
        notifySaved();
        closeModal();
      }
    },
  });
  const [attributeUpdate, attributeUpdateOpts] = useAttributeUpdateMutation({
    onCompleted: data => {
      if (data?.attributeUpdate?.errors.length === 0) {
        notifySaved();
      }
    },
  });
  const [attributeValueCreate, attributeValueCreateOpts] = useAttributeValueCreateMutation({
    onCompleted: data => {
      if (data?.attributeValueCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "xVn5B0",
            defaultMessage: "Added new value",
            description: "added new attribute value",
          }),
        });
        closeModal();
      }
    },
  });
  const [attributeValueReorder] = useAttributeValueReorderMutation({
    onCompleted: data => {
      if (data?.attributeReorderValues?.errors.length !== 0) {
        notify({
          status: "error",
          text: getAttributeErrorMessage(data?.attributeReorderValues?.errors[0], intl),
        });
      } else {
        notifySaved();
      }
    },
  });
  const handleValueReorder = ({ newIndex, oldIndex }: ReorderEvent) =>
    attributeValueReorder({
      optimisticResponse: {
        __typename: "Mutation",
        attributeReorderValues: {
          __typename: "AttributeReorderValues",
          attribute: {
            ...data?.attribute!,
            choices: {
              __typename: "AttributeValueCountableConnection",
              pageInfo: {
                ...data?.attribute?.choices?.pageInfo!,
              },
              edges: move(
                data?.attribute?.choices?.edges[oldIndex]!,
                data?.attribute?.choices?.edges ?? [],
                (a, b) => a?.node.id === b?.node.id,
                newIndex,
              ),
            },
          },
          errors: [],
        },
      },
      variables: {
        id,
        move: {
          id: data?.attribute?.choices?.edges[oldIndex].node.id ?? "",
          sortOrder: newIndex - oldIndex,
        },
        firstValues: valuesPaginationState.first,
        lastValues: valuesPaginationState.last,
        afterValues: valuesPaginationState.after,
        beforeValues: valuesPaginationState.before,
      },
    });
  const handleSubmit = async (data: AttributePageFormData) =>
    extractMutationErrors(
      attributeUpdate({
        variables: {
          id,
          input: {
            ...omit(data, ["entityType", "inputType", "metadata", "privateMetadata"]),
            storefrontSearchPosition: parseInt(data.storefrontSearchPosition, 10),
            referenceTypes: data.referenceTypes.map(ref => ref.value),
          },
        },
      }),
    );

  return (
    <AttributePage
      attribute={data?.attribute}
      assignedTypes={assignedTypes}
      disabled={isInitialLoading}
      errors={attributeUpdateOpts.data?.attributeUpdate?.errors || []}
      onDelete={() => openModal("remove")}
      onShowMetadata={() => openModal("view-metadata", { id: undefined })}
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
      saveButtonBarState={attributeUpdateOpts.status}
      values={data?.attribute?.choices}
      settings={settings}
      onUpdateListSettings={updateListSettings}
      pageInfo={pageInfo ?? { hasNextPage: false, hasPreviousPage: false }}
      onNextPage={loadNextPage}
      onPreviousPage={loadPreviousPage}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
    >
      {attributeFormData => (
        <>
          <AttributeMetadataDialog
            open={params.action === "view-metadata" && !!data?.attribute}
            onClose={closeModal}
            attribute={data?.attribute}
            refetchAttribute={refetch}
          />
          <AttributeDeleteDialog
            open={params.action === "remove"}
            name={data?.attribute?.name ?? "..."}
            confirmButtonState={attributeDeleteOpts.status}
            onClose={closeModal}
            onConfirm={() =>
              attributeDelete({
                variables: {
                  id,
                },
              })
            }
          />
          <AttributeValueDeleteDialog
            attributeName={data?.attribute?.name ?? "..."}
            open={params.action === "remove-value"}
            name={getStringOrPlaceholder(
              data?.attribute?.choices?.edges?.find(value => params.id === value.node.id)?.node
                ?.name ?? "",
            )}
            useName={true}
            confirmButtonState={attributeValueDeleteOpts.status}
            onClose={closeModal}
            onConfirm={() =>
              attributeValueDelete({
                variables: {
                  id: params?.id ?? "",
                  firstValues: valuesPaginationState.first,
                  lastValues: valuesPaginationState.last,
                  afterValues: valuesPaginationState.after,
                  beforeValues: valuesPaginationState.before,
                },
              })
            }
          />
          <AttributeValueEditDialog
            inputType={attributeFormData.inputType}
            attributeValue={null}
            confirmButtonState={attributeValueCreateOpts.status}
            disabled={isInitialLoading}
            errors={attributeValueCreateOpts.data?.attributeValueCreate?.errors || []}
            open={params.action === "add-value"}
            onClose={closeModal}
            onSubmit={input =>
              attributeValueCreate({
                variables: {
                  id,
                  input,
                  firstValues: valuesPaginationState.first,
                  lastValues: valuesPaginationState.last,
                  afterValues: valuesPaginationState.after,
                  beforeValues: valuesPaginationState.before,
                },
              })
            }
          />
          <AttributeValueEditDialog
            inputType={attributeFormData.inputType}
            attributeValue={attributeValueFragmentToFormData(
              data?.attribute?.choices?.edges?.find(value => params.id === value.node.id)?.node ??
                null,
            )}
            confirmButtonState={attributeValueUpdateOpts.status}
            disabled={isInitialLoading}
            errors={attributeValueUpdateOpts.data?.attributeValueUpdate?.errors || []}
            open={params.action === "edit-value"}
            onClose={closeModal}
            onSubmit={input =>
              attributeValueUpdate({
                variables: {
                  id:
                    data?.attribute?.choices?.edges?.find(value => params.id === value.node.id)
                      ?.node?.id || "",
                  input,
                  firstValues: valuesPaginationState.first,
                  lastValues: valuesPaginationState.last,
                  afterValues: valuesPaginationState.after,
                  beforeValues: valuesPaginationState.before,
                },
              })
            }
          />
        </>
      )}
    </AttributePage>
  );
};

AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
