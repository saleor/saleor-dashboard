import { InitialConstraints } from "@dashboard/components/AssignProductDialog/ModalProductFilterProvider";
import {
  ProductWhereInput,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";

export interface ReferenceSearchResults {
  pages: RelayToFlat<NonNullable<SearchPagesQuery["search"]>>;
  products: RelayToFlat<NonNullable<SearchProductsQuery["search"]>>;
  categories: RelayToFlat<NonNullable<SearchCategoriesQuery["search"]>>;
  collections: RelayToFlat<NonNullable<SearchCollectionsQuery["search"]>>;
}

export interface ReferenceModalState {
  openAttributeId: string | null;
  initialConstraints: InitialConstraints | undefined;
}

export interface ReferenceSearchActions {
  searchPages: (query: string) => void;
  searchProducts: (query: string) => void;
  searchCategories: (query: string) => void;
  searchCollections: (query: string) => void;
  fetchMorePages: FetchMoreProps | undefined;
  fetchMoreProducts: FetchMoreProps | undefined;
  fetchMoreCategories: FetchMoreProps | undefined;
  fetchMoreCollections: FetchMoreProps | undefined;
  onProductFilterChange: (filterVariables: ProductWhereInput, channel: string | undefined) => void;
}
