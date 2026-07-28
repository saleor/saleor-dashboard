import { type CategoryListRow } from "@dashboard/categories/views/CategoryList/types";
import { atom, createStore, Provider as JotaiProvider, useAtomValue } from "jotai";
import { type PropsWithChildren, useEffect, useState } from "react";

export interface CategoryListPageState {
  rows: CategoryListRow[];
  selectedCategoriesIds: string[];
  onCategoriesDelete: () => void;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  onSelectedCategoriesIdsChange?: (ids: string[]) => void;
  isCategoryExpanded?: (categoryId: string) => boolean;
  onCategoryExpandToggle?: (categoryId: string) => void;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  isLoadingMoreSubcategories?: (parentId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
  onLoadMoreSubcategories?: (parentId: string) => void;
  hasExpandedSubcategories: boolean;
  onCollapseAllSubcategories: () => void;
}

const categoryListPageStateNotInitialized = Symbol("categoryListPageStateNotInitialized");

// eslint-disable-next-line react-refresh/only-export-components
export const categoryListPageStateAtom = atom<
  CategoryListPageState | typeof categoryListPageStateNotInitialized
>(categoryListPageStateNotInitialized);

interface CategoryListPageStateProviderProps extends PropsWithChildren {
  value: CategoryListPageState;
}

export const CategoryListPageStateProvider = ({
  children,
  value,
}: CategoryListPageStateProviderProps): JSX.Element => {
  const [store] = useState(() => {
    const initialStore = createStore();

    initialStore.set(categoryListPageStateAtom, value);

    return initialStore;
  });

  useEffect(() => {
    store.set(categoryListPageStateAtom, value);
  }, [store, value]);

  return <JotaiProvider store={store}>{children}</JotaiProvider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCategoryListPageState = (): CategoryListPageState => {
  const state = useAtomValue(categoryListPageStateAtom);

  if (state === categoryListPageStateNotInitialized) {
    throw new Error(
      "useCategoryListPageState must be used within CategoryListPageStateProvider with a value",
    );
  }

  return state;
};
