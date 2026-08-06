import { CategoryBulkDeleteDialog } from "@dashboard/categories/components/CategoryBulkDeleteDialog/CategoryBulkDeleteDialog";
import { CategoryDeleteImageDialog } from "@dashboard/categories/components/CategoryDeleteImageDialog/CategoryDeleteImageDialog";
import { CategoryMetadataDialog } from "@dashboard/categories/components/CategoryMetadataDialog/CategoryMetadataDialog";
import { useEntityBackgroundImageUpload } from "@dashboard/components/EntityBackgroundImageField/useEntityBackgroundImageUpload";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type CategoryBulkDeleteMutation,
  type CategoryDeleteMutation,
  type CategoryInput,
  type CategoryUpdateMutation,
  ProductErrorCode,
  type ProductErrorFragment,
  useCategoryBulkDeleteMutation,
  useCategoryCreateMutation,
  useCategoryDeleteMutation,
  useCategoryDetailsQuery,
  useCategoryUpdateMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { useIntl } from "react-intl";

import { PAGINATE_BY } from "../../config";
import { extractMutationErrors, getMutationErrors, maybe } from "../../misc";
import { CategoryDeleteDialog } from "../components/CategoryDeleteDialog/CategoryDeleteDialog";
import { CategoryUpdatePage } from "../components/CategoryUpdatePage/CategoryUpdatePage";
import { type CategoryUpdateData } from "../components/CategoryUpdatePage/form";
import { CreateCategoryDialog } from "../components/CreateCategoryDialog/CreateCategoryDialog";
import { messages as createCategoryMessages } from "../components/CreateCategoryDialog/messages";
import {
  categoryListUrl,
  categoryUrl,
  type CategoryUrlDialog,
  type CategoryUrlQueryParams,
} from "../urls";

interface CategoryDetailsProps {
  params: CategoryUrlQueryParams;
  id: string;
}

const toPaginatorContext = (pagination: {
  pageInfo?: {
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
  };
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  paginatorType: "click";
}): PaginatorContextValues => ({
  ...pagination.pageInfo,
  loadNextPage: pagination.loadNextPage,
  loadPreviousPage: pagination.loadPreviousPage,
  paginatorType: pagination.paginatorType,
});

const CategoryDetails = ({ id, params }: CategoryDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const {
    clearRowSelection: clearCategoryRowSelection,
    selectedRowIds: selectedCategoryRowIds,
    setClearDatagridRowSelectionCallback: setClearCategoryDatagridRowSelectionCallback,
    setSelectedRowIds: setSelectedCategoryRowIds,
    excludeFromSelected: excludeCategoryFromSelected,
  } = useRowSelection();
  const { settings, updateListSettings } = useListSettings<ListViews.CATEGORY_LIST>(
    ListViews.CATEGORY_LIST,
  );
  const rowNumber = settings?.rowNumber ?? PAGINATE_BY;
  const [childrenPaginationState, setChildrenPaginationState] = useLocalPaginationState(rowNumber);
  const paginateChildren = useLocalPaginator(setChildrenPaginationState);
  const { data, loading, refetch } = useCategoryDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      childrenFirst: childrenPaginationState.first,
      childrenAfter: childrenPaginationState.after,
      childrenLast: childrenPaginationState.last,
      childrenBefore: childrenPaginationState.before,
    },
  });

  useRegisterEntityRefresh(refetch);

  const {
    backgroundImageRevision,
    backgroundImageUploadPreview,
    isBackgroundImageUploading,
    onBackgroundImageUploadPreviewLoaded,
    runImageMutation,
  } = useEntityBackgroundImageUpload();

  const category = data?.category;
  const subcategories = mapEdgesToItems(data?.category?.children) ?? [];
  const subcategoriesPaginator = toPaginatorContext(
    paginateChildren(data?.category?.children?.pageInfo, childrenPaginationState),
  );
  const handleCategoryDelete = (data: CategoryDeleteMutation) => {
    if (data?.categoryDelete?.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "HvJPcU",
          defaultMessage: "Category deleted",
        }),
      });
      navigate(categoryListUrl());
    }
  };
  const [deleteCategory, deleteResult] = useCategoryDeleteMutation({
    onCompleted: handleCategoryDelete,
  });
  const notifyCategoryUpdated = () => {
    notify({
      status: "success",
      text: intl.formatMessage({ id: "H4Lcuk", defaultMessage: "Category updated" }),
    });
  };
  const handleCategoryUpdateErrors = (data: CategoryUpdateMutation) => {
    const backgroundImageError = data?.categoryUpdate?.errors.find(
      error => error.field === ("backgroundImage" as keyof CategoryInput),
    );

    if (backgroundImageError) {
      notify({
        status: "error",
        title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
        text: intl.formatMessage(errorMessages.imageUploadErrorText),
      });
    }
  };
  const handleCategoryUpdate = (data: CategoryUpdateMutation) => {
    if (data?.categoryUpdate?.errors.length! > 0) {
      handleCategoryUpdateErrors(data);
    } else {
      notifyCategoryUpdated();
    }
  };
  const [updateCategory, updateResult] = useCategoryUpdateMutation({
    onCompleted: handleCategoryUpdate,
  });
  const handleBulkCategoryDelete = (data: CategoryBulkDeleteMutation) => {
    clearCategoryRowSelection();

    if (data?.categoryBulkDelete?.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
        text: intl.formatMessage({ id: "G5ETO0", defaultMessage: "Categories deleted" }),
      });
    }
  };
  const [categoryBulkDelete, categoryBulkDeleteOpts] = useCategoryBulkDeleteMutation({
    onCompleted: handleBulkCategoryDelete,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryUrlDialog,
    CategoryUrlQueryParams
  >(navigate, params => categoryUrl(id, params), params);
  const [createCategory, createCategoryOpts] = useCategoryCreateMutation({
    onCompleted: createData => {
      if ((createData.categoryCreate?.errors.length ?? 0) > 0) {
        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(createCategoryMessages.created),
      });
      closeModal();
      navigate(categoryUrl(createData.categoryCreate?.category?.id ?? ""));
    },
  });
  const handleImmediateCategoryImageMutation = async (
    input: Pick<CategoryInput, "backgroundImage"> &
      Partial<Pick<CategoryInput, "backgroundImageAlt">>,
  ) => {
    const uploadFile = input.backgroundImage instanceof File ? input.backgroundImage : null;

    try {
      await runImageMutation({
        file: uploadFile,
        mutate: async () => {
          const result = await updateCategory({
            variables: {
              id,
              input,
            },
          });
          const errors = getMutationErrors(result);

          if (errors.length === 0) {
            closeModal();

            if (uploadFile) {
              await refetch();
            }

            return true;
          }

          return false;
        },
      });
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });
    }
  };
  const handleUpdate = async (formData: CategoryUpdateData): Promise<ProductErrorFragment[]> => {
    try {
      return await extractMutationErrors(
        updateCategory({
          variables: {
            id,
            input: {
              backgroundImageAlt: formData.backgroundImageAlt,
              description: getParsedDataForJsonStringField(formData?.description!),
              name: formData.name,
              seo: {
                description: formData.seoDescription,
                title: formData.seoTitle,
              },
              slug: formData.slug,
            },
          },
        }),
      );
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return [
        {
          __typename: "ProductError",
          code: ProductErrorCode.GRAPHQL_ERROR,
          field: null,
          message: intl.formatMessage(commonMessages.somethingWentWrong),
        },
      ];
    }
  };

  if (category === null) {
    return <NotFoundPage onBack={() => navigate(categoryListUrl())} />;
  }

  return (
    <>
      <WindowTitle title={data?.category?.name!} />
      <CategoryUpdatePage
        categoryId={id}
        params={params}
        settings={settings}
        onUpdateListSettings={updateListSettings}
        category={data?.category}
        backgroundImageRevision={backgroundImageRevision}
        backgroundImageUploadPreview={backgroundImageUploadPreview}
        isBackgroundImageUploading={isBackgroundImageUploading}
        onBackgroundImageUploadPreviewLoaded={onBackgroundImageUploadPreviewLoaded}
        disabled={loading}
        errors={updateResult?.data?.categoryUpdate?.errors || []}
        onDelete={() => openModal("delete")}
        onImageDelete={() => openModal("removeImage")}
        onImageUpload={file => handleImmediateCategoryImageMutation({ backgroundImage: file })}
        onSubmit={handleUpdate}
        subcategories={subcategories}
        subcategoryTotalCount={data?.category?.children?.totalCount}
        subcategoriesPaginator={subcategoriesPaginator}
        saveButtonBarState={updateResult.status}
        selectedCategoryIds={selectedCategoryRowIds}
        setSelectedCategoryIds={setSelectedCategoryRowIds}
        clearCategoryRowSelection={clearCategoryRowSelection}
        excludeCategoryFromSelected={excludeCategoryFromSelected}
        setClearCategoryDatagridRowSelectionCallback={setClearCategoryDatagridRowSelectionCallback}
        onShowMetadata={() => openModal("view-metadata")}
        onCreateSubcategory={() => openModal("create")}
        onCategoriesDelete={() => {
          openModal("delete-categories");
        }}
      />

      <CreateCategoryDialog
        open={params.action === "create"}
        parentId={id}
        parentName={category?.name}
        onClose={closeModal}
        confirmButtonState={createCategoryOpts.status}
        disabled={createCategoryOpts.loading}
        errors={createCategoryOpts.data?.categoryCreate?.errors ?? []}
        onSubmit={async ({ name, description }) => {
          const result = await createCategory({
            variables: {
              parent: id,
              input: {
                name,
                ...(description
                  ? { description: getParsedDataForJsonStringField(description) }
                  : {}),
              },
            },
          });
          const errors = getMutationErrors(result);

          return Array.isArray(errors) ? (errors as ProductErrorFragment[]) : [];
        }}
      />

      <CategoryMetadataDialog
        open={params.action === "view-metadata" && !!category}
        onClose={closeModal}
        category={category}
      />

      <CategoryDeleteDialog
        categoryName={<strong>{data?.category?.name || "..."}</strong>}
        confirmButtonState={deleteResult.status}
        onClose={closeModal}
        onConfirm={() => deleteCategory({ variables: { id } })}
        open={params.action === "delete"}
      />

      <CategoryDeleteImageDialog
        confirmButtonState={updateResult.status}
        onClose={closeModal}
        onConfirm={() =>
          handleImmediateCategoryImageMutation({
            backgroundImage: null,
            backgroundImageAlt: "",
          })
        }
        open={params.action === "removeImage"}
      />

      <CategoryBulkDeleteDialog
        confirmButtonState={categoryBulkDeleteOpts.status}
        count={maybe(() => selectedCategoryRowIds.length) ?? 0}
        onClose={closeModal}
        onConfirm={() =>
          categoryBulkDelete({
            variables: { ids: selectedCategoryRowIds },
          }).then(() => refetch())
        }
        open={params.action === "delete-categories"}
      />
    </>
  );
};

export default CategoryDetails;
