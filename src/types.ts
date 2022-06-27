import { FetchResult, MutationResult } from "@apollo/client";
import { UserPermissionFragment } from "@saleor/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";

import { FilterElement, IFilter } from "./components/Filter";
import { MultiAutocompleteChoiceType } from "./components/MultiAutocompleteSelectField";

export interface UserError {
  field: string | null;
  message?: string;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export interface ListSettings<TColumn extends string = string> {
  columns?: TColumn[];
  rowNumber: number;
}

export enum ListViews {
  APPS_LIST = "APPS_LIST",
  ATTRIBUTE_LIST = "ATTRIBUTE_LIST",
  ATTRIBUTE_VALUE_LIST = "ATTRIBUTE_VALUE_LIST",
  CATEGORY_LIST = "CATEGORY_LIST",
  COLLECTION_LIST = "COLLECTION_LIST",
  CUSTOMER_LIST = "CUSTOMER_LIST",
  DRAFT_LIST = "DRAFT_LIST",
  NAVIGATION_LIST = "NAVIGATION_LIST",
  ORDER_LIST = "ORDER_LIST",
  PAGES_LIST = "PAGES_LIST",
  PAGE_TYPES_LIST = "PAGE_TYPES_LIST",
  PLUGINS_LIST = "PLUGIN_LIST",
  PRODUCT_LIST = "PRODUCT_LIST",
  PERMISSION_GROUP_LIST = "PERMISSION_GROUP_LIST",
  PRODUCT_TYPE_LIST = "PRODUCT_TYPE_LIST",
  SALES_LIST = "SALES_LIST",
  SHIPPING_METHODS_LIST = "SHIPPING_METHODS_LIST",
  STAFF_MEMBERS_LIST = "STAFF_MEMBERS_LIST",
  VOUCHER_LIST = "VOUCHER_LIST",
  WAREHOUSE_LIST = "WAREHOUSE_LIST",
  WEBHOOK_LIST = "WEBHOOK_LIST",
  TRANSLATION_ATTRIBUTE_VALUE_LIST = "TRANSLATION_ATTRIBUTE_VALUE_LIST",
  GIFT_CARD_LIST = " GIFT_CARD_LIST",
}

export interface ListProps<TColumns extends string = string> {
  disabled: boolean;
  settings?: ListSettings<TColumns>;
  onUpdateListSettings?: <T extends keyof ListSettings<TColumns>>(
    key: T,
    value: ListSettings<TColumns>[T],
  ) => void;
  onListSettingsReset?: () => void;
  filterDependency?: FilterElement;
}

export interface PaginateListProps {
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export interface SortPage<TSortKey extends string> {
  sort: Sort<TSortKey>;
  onSort: (field: TSortKey, id?: string) => void;
}

/**
 * @param toggle Will be use to change status of item
 * @param isChecked Returns true for ids of chosen items
 * @param selected  Number of chosen items.
 */

export interface ListActionsWithoutToolbar {
  toggle: (id: string) => void;
  toggleAll: (items: React.ReactNodeArray, selected: number) => void;
  isChecked: (id: string) => boolean;
  selected: number;
}
export type TabListActions<
  TToolbars extends string
> = ListActionsWithoutToolbar &
  Record<TToolbars, React.ReactNode | React.ReactNodeArray>;
export interface ListActions extends ListActionsWithoutToolbar {
  toolbar: React.ReactNode | React.ReactNodeArray;
}
export interface PageListProps<TColumns extends string = string>
  extends ListProps<TColumns> {
  defaultSettings?: ListSettings<TColumns>;
}

export interface SearchProps {
  onSearchChange: (value: string) => void;
}
export interface SearchPageProps extends SearchProps {
  initialSearch: string;
}
export interface FilterPageProps<TKeys extends string, TOpts extends {}>
  extends FilterProps<TKeys>,
    SearchPageProps,
    TabPageProps {
  filterOpts: TOpts;
}

export interface FilterProps<TKeys extends string> {
  currencySymbol?: string;
  onFilterChange: (filter: IFilter<TKeys>) => void;
  onFilterAttributeFocus?: (id?: string) => void;
}

export interface TabPageProps {
  currentTab: number;
  tabs: string[];
  onAll: () => void;
  onTabChange: (tab: number) => void;
  onTabDelete: () => void;
  onTabSave: () => void;
}

export interface ChannelProps {
  selectedChannelId: string;
}

export interface PartialMutationProviderOutput<
  TData extends {} = {},
  TVariables extends {} = {}
> {
  opts: MutationResult<TData> & MutationResultAdditionalProps;
  mutate: (variables: TVariables) => Promise<FetchResult<TData>>;
}

export interface Node {
  id: string;
}
export interface SlugNode {
  slug: string;
}

export interface TagNode {
  tag: string;
}

export type Pagination = Partial<{
  after: string;
  before: string;
}>;

export type Dialog<TDialog extends string> = Partial<{
  action: TDialog;
}>;
export type ActiveTab<TTab extends string = string> = Partial<{
  activeTab: TTab;
}>;
export type Filters<TFilters extends string> = Partial<
  Record<TFilters, string>
>;
export type FiltersWithMultipleValues<TFilters extends string> = Partial<
  Record<TFilters, string[]>
>;
export type FiltersAsDictWithMultipleValues<TFilters extends string> = Partial<
  Record<TFilters, Record<string, string[]>>
>;
export type FiltersWithKeyValueValues<TFilters extends string> = Partial<
  Record<TFilters, KeyValue[]>
>;
export type Search = Partial<{
  query: string;
}>;
export type SingleAction = Partial<{
  id: string;
}>;
export type Sort<TSort extends string = string> = Partial<{
  asc: boolean;
  sort: TSort;
}>;
export type BulkAction = Partial<{
  ids: string[];
}>;

export interface ReorderEvent {
  oldIndex: number;
  newIndex: number;
}
export type ReorderAction = (event: ReorderEvent) => void;

export interface FetchMoreProps {
  loading: boolean;
  hasMore: boolean;
  totalCount?: number;
  onFetchMore: () => void;
}

export type TabActionDialog = "save-search" | "delete-search";

export interface UserPermissionProps {
  userPermissions: UserPermissionFragment[];
}

export interface MutationResultAdditionalProps {
  status: ConfirmButtonTransitionState;
}

export interface KeyValue {
  key: string;
  value?: string;
}

export type MinMax = Record<"min" | "max", string>;

export interface FilterOpts<T> {
  active: boolean;
  value: T;
}

export interface AutocompleteFilterOpts
  extends Partial<FetchMoreProps>,
    Partial<SearchPageProps> {
  choices: MultiAutocompleteChoiceType[];
  displayValues: MultiAutocompleteChoiceType[];
}

export type Ids = string[];

export enum StatusType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
}

export type RelayToFlat<T extends { edges: Array<{ node: any }> }> = Array<
  T["edges"][0]["node"]
>;
