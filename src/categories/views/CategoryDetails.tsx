import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type CategoryBulkDeleteMutation,
  type CategoryDeleteMutation,
  type CategoryInput,
  type CategoryUpdateMutation,
  useCategoryBulkDeleteMutation,
  useCategoryDeleteMutation,
  useCategoryDetailsQuery,
  useCategoryUpdateMutation,
  useProductBulkDeleteMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  useSectionLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { errorMessages } from "@dashboard/intl";
import { ProductBulkDeleteDialog } from "@dashboard/products/components/ProductBulkDeleteDialog/ProductBulkDeleteDialog";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import isEqual from "lodash/isEqual";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";

import { PAGINATE_BY } from "../../config";
import { extractMutationErrors, maybe } from "../../misc";
import { productAddUrl } from "../../products/urls";
import { CategoryBulkDeleteDialog } from "../components/CategoryBulkDeleteDialog/CategoryBulkDeleteDialog";
import { CategoryDeleteDialog } from "../components/CategoryDeleteDialog/CategoryDeleteDialog";
import {
  CategoryPageTab,
  CategoryUpdatePage,
} from "../components/CategoryUpdatePage/CategoryUpdatePage";
import { type CategoryUpdateData } from "../components/CategoryUpdatePage/form";
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

const CategoryDetails = ({ id, params }: CategoryDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const {
    clearRowSelection: clearProductRowSelection,
    selectedRowIds: selectedProductRowIds,
    setClearDatagridRowSelectionCallback: setClearProductDatagridRowSelectionCallback,
    setSelectedRowIds: setSelectedProductRowIds,
  } = useRowSelection();
  const {
    clearRowSelection: clearCategryRowSelection,
    selectedRowIds: selectedCategoryRowIds,
    setClearDatagridRowSelectionCallback: setClearCategoryDatagridRowSelectionCallback,
    setSelectedRowIds: setSelectedCategoryRowIds,
    excludeFromSelected: excludeCategoryFromSelected,
  } = useRowSelection();
  const [activeTab, setActiveTab] = useState<CategoryPageTab>(CategoryPageTab.categories);
  const [paginationState, setPaginationState] = useSectionLocalPaginationState(
    PAGINATE_BY,
    activeTab,
  );
  const paginate = useLocalPaginator(setPaginationState);
  const changeTab = (tab: CategoryPageTab) => {
    clearProductRowSelection();
    clearCategryRowSelection();
    setActiveTab(tab);
  };
  const { settings, updateListSettings } = useListSettings<ListViews.CATEGORY_LIST>(
    ListViews.CATEGORY_LIST,
  );
  const { data, loading, refetch } = useCategoryDetailsQuery({
    displayLoader: true,
    variables: { ...paginationState, id },
  });

  useRegisterEntityRefresh(refetch);

  const category = data?.category;
  const subcategories = mapEdgesToItems(data?.category?.children);
  const products = mapEdgesToItems(data?.category?.products);
  const handleCategoryDelete = (data: CategoryDeleteMutation) => {
    if (data?.categoryDelete?.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "HvJPcU",
          defaultMessage: "Category deleted",
        }),
      });
      clearProductRowSelection();
      navigate(categoryListUrl());
    }
  };
  const [deleteCategory, deleteResult] = useCategoryDeleteMutation({
    onCompleted: handleCategoryDelete,
  });
  const handleCategoryUpdate = (data: CategoryUpdateMutation) => {
    clearProductRowSelection();

    if (data?.categoryUpdate?.errors.length! > 0) {
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
    } else {
      notify({
        status: "success",
        text: intl.formatMessage({ id: "H4Lcuk", defaultMessage: "Category updated" }),
      });
    }
  };
  const [updateCategory, updateResult] = useCategoryUpdateMutation({
    onCompleted: handleCategoryUpdate,
  });
  const handleBulkCategoryDelete = (data: CategoryBulkDeleteMutation) => {
    clearCategryRowSelection();

    if (data?.categoryBulkDelete?.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
        text: intl.formatMessage({ id: "H4Lcuk", defaultMessage: "Category updated" }),
      });
    }
  };
  const [categoryBulkDelete, categoryBulkDeleteOpts] = useCategoryBulkDeleteMutation({
    onCompleted: handleBulkCategoryDelete,
  });
  const [productBulkDelete, productBulkDeleteOpts] = useProductBulkDeleteMutation({
    onCompleted: data => {
      clearProductRowSelection();

      if (data?.productBulkDelete?.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({ id: "H4Lcuk", defaultMessage: "Category updated" }),
        });
        refetch();
      }
    },
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryUrlDialog,
    CategoryUrlQueryParams
  >(navigate, params => categoryUrl(id, params), params);
  const { pageInfo, ...paginationFunctions } = paginate(
    activeTab === CategoryPageTab.categories
      ? data?.category?.children?.pageInfo
      : data?.category?.products?.pageInfo,
    paginationState,
  );
  const handleUpdate = async (formData: CategoryUpdateData) =>
    extractMutationErrors(
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
  const handleSetSelectedPrductIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!products) {
        return;
      }

      const rowsIds = rows.map(row => products[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedProductRowIds);

      if (!haveSaveValues) {
        setSelectedProductRowIds(rowsIds);
      }

      setClearProductDatagridRowSelectionCallback(clearSelection);
    },
    [
      products,
      selectedProductRowIds,
      setClearProductDatagridRowSelectionCallback,
      setSelectedProductRowIds,
    ],
  );
  const handleSubmit = createMetadataUpdateHandler(
    data?.category!,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  if (category === null) {
    return <NotFoundPage onBack={() => navigate(categoryListUrl())} />;
  }

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationFunctions }}>
      <WindowTitle title={data?.category?.name!} />
      <CategoryUpdatePage
        categoryId={id}
        settings={settings}
        onUpdateListSettings={updateListSettings}
        changeTab={changeTab}
        currentTab={activeTab}
        category={data?.category}
        disabled={loading}
        errors={updateResult?.data?.categoryUpdate?.errors || []}
        addProductHref={productAddUrl()}
        onDelete={() => openModal("delete")}
        onImageDelete={() =>
          updateCategory({
            variables: {
              id,
              input: {
                backgroundImage: null,
              },
            },
          })
        }
        onImageUpload={file =>
          updateCategory({
            variables: {
              id,
              input: {
                backgroundImage: file,
              },
            },
          })
        }
        onSubmit={handleSubmit}
        products={products}
        saveButtonBarState={updateResult.status}
        subcategories={subcategories}
        selectedCategoryIds={selectedCategoryRowIds}
        setSelectedCategoryIds={setSelectedCategoryRowIds}
        clearCategoryRowSelection={clearCategryRowSelection}
        excludeCategoryFromSelected={excludeCategoryFromSelected}
        setClearCategoryDatagridRowSelectionCallback={setClearCategoryDatagridRowSelectionCallback}
        onSelectProductsIds={handleSetSelectedPrductIds}
        onCategoriesDelete={() => {
          openModal("delete-categories");
        }}
        onProductsDelete={() => {
          openModal("delete-products");
        }}
      />

      <CategoryDeleteDialog
        categoryName={<strong>{data?.category?.name || "..."}</strong>}
        confirmButtonState={deleteResult.status}
        onClose={closeModal}
        onConfirm={() => deleteCategory({ variables: { id } })}
        open={params.action === "delete"}
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

      <ProductBulkDeleteDialog
        confirmButtonState={productBulkDeleteOpts.status}
        count={maybe(() => selectedProductRowIds.length) ?? 0}
        onClose={closeModal}
        onConfirm={() =>
          productBulkDelete({
            variables: { ids: selectedProductRowIds },
          }).then(() => refetch())
        }
        open={params.action === "delete-products"}
      />
    </PaginatorContext.Provider>
  );
};

export default CategoryDetails;
