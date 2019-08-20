import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { PAGINATE_BY } from "../../config";
import { getMutationState, maybe } from "../../misc";
import { TypedProductBulkDeleteMutation } from "../../products/mutations";
import { productBulkDelete } from "../../products/types/productBulkDelete";
import { productAddUrl, productUrl } from "../../products/urls";
import { CategoryInput } from "../../types/globalTypes";
import {
  CategoryPageTab,
  CategoryUpdatePage
} from "../components/CategoryUpdatePage/CategoryUpdatePage";
import {
  TypedCategoryBulkDeleteMutation,
  TypedCategoryDeleteMutation,
  TypedCategoryUpdateMutation
} from "../mutations";
import { TypedCategoryDetailsQuery } from "../queries";
import { CategoryBulkDelete } from "../types/CategoryBulkDelete";
import { CategoryDelete } from "../types/CategoryDelete";
import { CategoryUpdate } from "../types/CategoryUpdate";
import {
  categoryAddUrl,
  categoryListUrl,
  categoryUrl,
  CategoryUrlDialog,
  CategoryUrlQueryParams
} from "../urls";

export interface CategoryDetailsProps {
  params: CategoryUrlQueryParams;
  id: string;
}

export function getActiveTab(tabName: string): CategoryPageTab {
  return tabName === CategoryPageTab.products
    ? CategoryPageTab.products
    : CategoryPageTab.categories;
}

export const CategoryDetails: React.StatelessComponent<
  CategoryDetailsProps
> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();

  const handleCategoryDelete = (data: CategoryDelete) => {
    if (data.categoryDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Category deleted",
          id: "categoryDetailsCategoryDeleted"
        })
      });
      navigate(categoryListUrl());
    }
  };
  const handleCategoryUpdate = (data: CategoryUpdate) => {
    if (data.categoryUpdate.errors.length > 0) {
      const backgroundImageError = data.categoryUpdate.errors.find(
        error => error.field === ("backgroundImage" as keyof CategoryInput)
      );
      if (backgroundImageError) {
        notify({
          text: backgroundImageError.message
        });
      }
    }
  };

  const changeTab = (tabName: CategoryPageTab) => {
    reset();
    navigate(
      categoryUrl(id, {
        activeTab: tabName
      })
    );
  };

  const closeModal = () =>
    navigate(
      categoryUrl(id, {
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: CategoryUrlDialog, ids?: string[]) =>
    navigate(
      categoryUrl(id, {
        ...params,
        action,
        ids
      })
    );

  return (
    <TypedCategoryDeleteMutation onCompleted={handleCategoryDelete}>
      {(deleteCategory, deleteResult) => (
        <TypedCategoryUpdateMutation onCompleted={handleCategoryUpdate}>
          {(updateCategory, updateResult) => {
            const paginationState = createPaginationState(PAGINATE_BY, params);
            const formTransitionState = getMutationState(
              updateResult.called,
              updateResult.loading,
              maybe(() => updateResult.data.categoryUpdate.errors)
            );
            const removeDialogTransitionState = getMutationState(
              deleteResult.called,
              deleteResult.loading,
              maybe(() => deleteResult.data.categoryDelete.errors)
            );
            return (
              <TypedCategoryDetailsQuery
                displayLoader
                variables={{ ...paginationState, id }}
                require={["category"]}
              >
                {({ data, loading, refetch }) => {
                  const handleBulkCategoryDelete = (
                    data: CategoryBulkDelete
                  ) => {
                    if (data.categoryBulkDelete.errors.length === 0) {
                      closeModal();
                      notify({
                        text: intl.formatMessage({
                          defaultMessage: "Categories removed",
                          id: "categoryDetailsCategoriesRemoved"
                        })
                      });
                      refetch();
                      reset();
                    }
                  };

                  const handleBulkProductDelete = (data: productBulkDelete) => {
                    if (data.productBulkDelete.errors.length === 0) {
                      closeModal();
                      notify({
                        text: intl.formatMessage({
                          defaultMessage: "Products removed",
                          id: "categoryDetailsProductsRemoved"
                        })
                      });
                      refetch();
                      reset();
                    }
                  };

                  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
                    maybe(() => data.category.products.pageInfo),
                    paginationState,
                    params
                  );

                  return (
                    <>
                      <WindowTitle title={maybe(() => data.category.name)} />
                      <TypedCategoryBulkDeleteMutation
                        onCompleted={handleBulkCategoryDelete}
                      >
                        {(categoryBulkDelete, categoryBulkDeleteOpts) => (
                          <TypedProductBulkDeleteMutation
                            onCompleted={handleBulkProductDelete}
                          >
                            {(productBulkDelete, productBulkDeleteOpts) => {
                              const categoryBulkDeleteMutationState = getMutationState(
                                categoryBulkDeleteOpts.called,
                                categoryBulkDeleteOpts.loading,
                                maybe(
                                  () =>
                                    categoryBulkDeleteOpts.data
                                      .categoryBulkDelete.errors
                                )
                              );
                              const productBulkDeleteMutationState = getMutationState(
                                productBulkDeleteOpts.called,
                                productBulkDeleteOpts.loading,
                                maybe(
                                  () =>
                                    productBulkDeleteOpts.data.productBulkDelete
                                      .errors
                                )
                              );

                              return (
                                <>
                                  <CategoryUpdatePage
                                    changeTab={changeTab}
                                    currentTab={params.activeTab}
                                    category={maybe(() => data.category)}
                                    disabled={loading}
                                    errors={maybe(
                                      () =>
                                        updateResult.data.categoryUpdate.errors
                                    )}
                                    onAddCategory={() =>
                                      navigate(categoryAddUrl(id))
                                    }
                                    onAddProduct={() => navigate(productAddUrl)}
                                    onBack={() =>
                                      navigate(
                                        maybe(
                                          () =>
                                            categoryUrl(
                                              data.category.parent.id
                                            ),
                                          categoryListUrl()
                                        )
                                      )
                                    }
                                    onCategoryClick={id => () =>
                                      navigate(categoryUrl(id))}
                                    onDelete={() => openModal("delete")}
                                    onImageDelete={() =>
                                      updateCategory({
                                        variables: {
                                          id,
                                          input: {
                                            backgroundImage: null
                                          }
                                        }
                                      })
                                    }
                                    onImageUpload={file =>
                                      updateCategory({
                                        variables: {
                                          id,
                                          input: {
                                            backgroundImage: file
                                          }
                                        }
                                      })
                                    }
                                    onNextPage={loadNextPage}
                                    onPreviousPage={loadPreviousPage}
                                    pageInfo={pageInfo}
                                    onProductClick={id => () =>
                                      navigate(productUrl(id))}
                                    onSubmit={formData =>
                                      updateCategory({
                                        variables: {
                                          id,
                                          input: {
                                            backgroundImageAlt:
                                              formData.backgroundImageAlt,
                                            descriptionJson: JSON.stringify(
                                              formData.description
                                            ),
                                            name: formData.name,
                                            seo: {
                                              description:
                                                formData.seoDescription,
                                              title: formData.seoTitle
                                            }
                                          }
                                        }
                                      })
                                    }
                                    products={maybe(() =>
                                      data.category.products.edges.map(
                                        edge => edge.node
                                      )
                                    )}
                                    saveButtonBarState={formTransitionState}
                                    subcategories={maybe(() =>
                                      data.category.children.edges.map(
                                        edge => edge.node
                                      )
                                    )}
                                    subcategoryListToolbar={
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          openModal(
                                            "delete-categories",
                                            listElements
                                          )
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                    productListToolbar={
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          openModal(
                                            "delete-products",
                                            listElements
                                          )
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                    isChecked={isSelected}
                                    selected={listElements.length}
                                    toggle={toggle}
                                    toggleAll={toggleAll}
                                  />
                                  <ActionDialog
                                    confirmButtonState={
                                      removeDialogTransitionState
                                    }
                                    onClose={closeModal}
                                    onConfirm={() =>
                                      deleteCategory({ variables: { id } })
                                    }
                                    open={params.action === "delete"}
                                    title={intl.formatMessage({
                                      defaultMessage: "Delete category",
                                      description: "dialog title",
                                      id:
                                        "categoryDetailsDeleteCategoryDialogTitle"
                                    })}
                                    variant="delete"
                                  >
                                    <DialogContentText>
                                      <FormattedMessage
                                        defaultMessage="Are you sure you want to remove {name}?"
                                        description="remove category"
                                        id="categoryDetailsDeleteCategoryDialogContent"
                                        values={{
                                          name: (
                                            <strong>
                                              {maybe(
                                                () => data.category.name,
                                                "..."
                                              )}
                                            </strong>
                                          )
                                        }}
                                      />
                                    </DialogContentText>
                                    <DialogContentText>
                                      <FormattedMessage
                                        defaultMessage="Remember that this will also remove all products assigned to this category."
                                        id="categoryDetailsDeleteCategoryDialogContentAdditionalText"
                                      />
                                    </DialogContentText>
                                  </ActionDialog>
                                  <ActionDialog
                                    open={
                                      params.action === "delete-categories" &&
                                      maybe(() => params.ids.length > 0)
                                    }
                                    confirmButtonState={
                                      categoryBulkDeleteMutationState
                                    }
                                    onClose={closeModal}
                                    onConfirm={() =>
                                      categoryBulkDelete({
                                        variables: { ids: params.ids }
                                      })
                                    }
                                    title={intl.formatMessage({
                                      defaultMessage: "Remove categories",
                                      description: "dialog title",
                                      id:
                                        "categoryDetailsDeleteSubcategoriesDialogTitle"
                                    })}
                                    variant="delete"
                                  >
                                    <DialogContentText>
                                      <FormattedMessage
                                        defaultMessage="Are you sure you want to remove {counter, plural,
                                          one {this attribute}
                                          other {{displayQuantity} categories}
                                        }?"
                                        id="categoryDetailsDeleteCategoriesDialogContent"
                                        values={{
                                          counter: params.ids.length,
                                          displayQuantity: (
                                            <strong>{params.ids.length}</strong>
                                          )
                                        }}
                                      />
                                    </DialogContentText>
                                    <DialogContentText>
                                      <FormattedMessage
                                        defaultMessage="Remember that this will also remove all products assigned to this category."
                                        id="categoryDetailsDeleteCategoriesDialogContentAdditionalText"
                                      />
                                    </DialogContentText>
                                  </ActionDialog>
                                  <ActionDialog
                                    open={params.action === "delete-products"}
                                    confirmButtonState={
                                      productBulkDeleteMutationState
                                    }
                                    onClose={closeModal}
                                    onConfirm={() =>
                                      productBulkDelete({
                                        variables: { ids: params.ids }
                                      })
                                    }
                                    title={intl.formatMessage({
                                      defaultMessage: "Remove products",
                                      description: "dialog title",
                                      id:
                                        "categoryDetailsDeleteProductsDialogTitle"
                                    })}
                                    variant="delete"
                                  >
                                    {" "}
                                    <DialogContentText>
                                      <FormattedMessage
                                        defaultMessage="Are you sure you want to remove {counter, plural,
                                          one {this attribute}
                                          other {{displayQuantity} products}
                                        }?"
                                        id="categoryDetailsDeleteProductsDialogContent"
                                        values={{
                                          counter: params.ids.length,
                                          displayQuantity: (
                                            <strong>{params.ids.length}</strong>
                                          )
                                        }}
                                      />
                                    </DialogContentText>
                                  </ActionDialog>
                                </>
                              );
                            }}
                          </TypedProductBulkDeleteMutation>
                        )}
                      </TypedCategoryBulkDeleteMutation>
                    </>
                  );
                }}
              </TypedCategoryDetailsQuery>
            );
          }}
        </TypedCategoryUpdateMutation>
      )}
    </TypedCategoryDeleteMutation>
  );
};
export default CategoryDetails;
