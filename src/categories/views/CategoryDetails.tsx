import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CategoryBulkDeleteMutation,
  CategoryDeleteMutation,
  CategoryInput,
  CategoryUpdateMutation,
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
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { Box } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PAGINATE_BY } from "../../config";
import { extractMutationErrors, maybe } from "../../misc";
import { productAddUrl } from "../../products/urls";
import {
  CategoryPageTab,
  CategoryUpdatePage,
} from "../components/CategoryUpdatePage/CategoryUpdatePage";
import { CategoryUpdateData } from "../components/CategoryUpdatePage/form";
import { categoryListUrl, categoryUrl, CategoryUrlDialog, CategoryUrlQueryParams } from "../urls";

interface CategoryDetailsProps {
  params: CategoryUrlQueryParams;
  id: string;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ id, params }) => {
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
        text: intl.formatMessage(commonMessages.savedChanges),
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
        text: intl.formatMessage(commonMessages.savedChanges),
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
          text: intl.formatMessage(commonMessages.savedChanges),
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
  const handleSetSelectedCategoryIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!subcategories) {
        return;
      }

      const rowsIds = rows.map(row => subcategories[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedCategoryRowIds);

      if (!haveSaveValues) {
        setSelectedCategoryRowIds(rowsIds);
      }

      setClearCategoryDatagridRowSelectionCallback(clearSelection);
    },
    [
      selectedCategoryRowIds,
      setClearCategoryDatagridRowSelectionCallback,
      setSelectedCategoryRowIds,
      subcategories,
    ],
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
        onSelectCategoriesIds={handleSetSelectedCategoryIds}
        onSelectProductsIds={handleSetSelectedPrductIds}
        onCategoriesDelete={() => {
          openModal("delete-categories");
        }}
        onProductsDelete={() => {
          openModal("delete-products");
        }}
      />

      <ActionDialog
        confirmButtonState={deleteResult.status}
        onClose={closeModal}
        onConfirm={() => deleteCategory({ variables: { id } })}
        open={params.action === "delete"}
        title={intl.formatMessage({
          id: "xo5UIb",
          defaultMessage: "Delete category",
          description: "dialog title",
        })}
        variant="delete"
      >
        <Box display="grid" gap={2}>
          <Box>
            <FormattedMessage
              id="xRkj2h"
              defaultMessage="Are you sure you want to delete {categoryName}?"
              values={{
                categoryName: <strong>{data?.category?.name || "..."}</strong>,
              }}
            />
          </Box>
          <Box>
            <FormattedMessage
              id="3DGvA/"
              defaultMessage="Remember this will also unpin all products assigned to this category, making them unavailable in storefront."
            />
          </Box>
        </Box>
      </ActionDialog>

      <ActionDialog
        open={params.action === "delete-categories"}
        confirmButtonState={categoryBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          categoryBulkDelete({
            variables: { ids: selectedCategoryRowIds },
          }).then(() => refetch())
        }
        title={intl.formatMessage({
          id: "sG0w22",
          defaultMessage: "Delete categories",
          description: "dialog title",
        })}
        variant="delete"
      >
        <Box display="grid" gap={2}>
          <Box>
            <FormattedMessage
              id="Pp/7T7"
              defaultMessage="{counter,plural,one{Are you sure you want to delete this category?} other{Are you sure you want to delete {displayQuantity} categories?}}"
              values={{
                counter: maybe(() => selectedCategoryRowIds.length),
                displayQuantity: <strong>{maybe(() => selectedCategoryRowIds.length)}</strong>,
              }}
            />
          </Box>
          <Box>
            <FormattedMessage
              id="e+L+q3"
              defaultMessage="Remember this will also delete all products assigned to this category."
            />
          </Box>
        </Box>
      </ActionDialog>

      <ActionDialog
        open={params.action === "delete-products"}
        confirmButtonState={productBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          productBulkDelete({
            variables: { ids: selectedProductRowIds },
          }).then(() => refetch())
        }
        title={intl.formatMessage({
          id: "KCjd1o",
          defaultMessage: "Delete products",
          description: "dialog title",
        })}
        variant="delete"
      >
        <Box>
          <FormattedMessage
            id="7l5Bh9"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
            values={{
              counter: maybe(() => selectedProductRowIds.length),
              displayQuantity: <strong>{maybe(() => selectedProductRowIds.length)}</strong>,
            }}
          />
        </Box>
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};

export default CategoryDetails;
