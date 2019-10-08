import { ShopInfo_shop_permissions } from "./components/Shop/types/ShopInfo";
import { Filter } from "./components/TableFilter";
import {
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps
} from "./types";
import { PermissionEnum } from "./types/globalTypes";

const pageInfo = {
  hasNextPage: true,
  hasPreviousPage: false
};
export const pageListProps: { [key: string]: PageListProps } = {
  default: {
    disabled: false,
    onAdd: undefined,
    onNextPage: undefined,
    onPreviousPage: undefined,
    onRowClick: () => undefined,
    pageInfo,
    settings: { rowNumber: 20 }
  },
  loading: {
    disabled: true,
    onAdd: undefined,
    onNextPage: undefined,
    onPreviousPage: undefined,
    onRowClick: () => undefined,
    pageInfo,
    settings: undefined
  }
};
export const listActionsProps: ListActions = {
  isChecked: () => undefined,
  selected: 0,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null
};

export const countries = [
  { code: "AF", label: "Afghanistan" },
  { code: "AX", label: "Åland Islands" },
  { code: "AL", label: "Albania" },
  { code: "DZ", label: "Algeria" },
  { code: "AS", label: "American Samoa" }
];

export const tabPageProps: TabPageProps = {
  currentTab: 0,
  onAll: () => undefined,
  onTabChange: () => undefined,
  onTabDelete: () => undefined,
  onTabSave: () => undefined,
  tabs: ["Tab X"]
};

export const searchPageProps: SearchPageProps = {
  initialSearch: "",
  onSearchChange: () => undefined
};

export const filterPageProps: FilterPageProps = {
  ...searchPageProps,
  ...tabPageProps,
  currencySymbol: "USD",
  filtersList: [],
  onFilterAdd: () => undefined
};

export const filters: Filter[] = [
  {
    label: "Property X is ",
    onClick: () => undefined
  },
  {
    label: "Property Y is ",
    onClick: () => undefined
  },
  {
    label: "Property Z is ",
    onClick: () => undefined
  },
  {
    label: "Property X is ",
    onClick: () => undefined
  },
  {
    label: "Property Y is ",
    onClick: () => undefined
  },
  {
    label: "Property Z is ",
    onClick: () => undefined
  },
  {
    label: "Property X is ",
    onClick: () => undefined
  },
  {
    label: "Property Y is ",
    onClick: () => undefined
  },
  {
    label: "Property Z is ",
    onClick: () => undefined
  },
  {
    label: "Property X is ",
    onClick: () => undefined
  },
  {
    label: "Property Y is ",
    onClick: () => undefined
  },
  {
    label: "Property Z is ",
    onClick: () => undefined
  },
  {
    label: "Property X is ",
    onClick: () => undefined
  },
  {
    label: "Property Y is ",
    onClick: () => undefined
  },
  {
    label: "Property Z is ",
    onClick: () => undefined
  }
].map((filter, filterIndex) => ({
  ...filter,
  label: filter.label + filterIndex
}));

export const fetchMoreProps: FetchMoreProps = {
  hasMore: true,
  loading: false,
  onFetchMore: () => undefined
};

export const sortPageProps: SortPage<string> = {
  onSort: () => undefined,
  sort: {
    asc: true
  }
};

export const permissions: ShopInfo_shop_permissions[] = [
  {
    code: PermissionEnum.IMPERSONATE_USERS,
    name: "Impersonate customers."
  },
  {
    code: PermissionEnum.MANAGE_DISCOUNTS,
    name: "Manage sales and vouchers."
  },
  {
    code: PermissionEnum.MANAGE_MENUS,
    name: "Manage navigation."
  },
  {
    code: PermissionEnum.MANAGE_ORDERS,
    name: "Manage orders."
  },
  {
    code: PermissionEnum.MANAGE_PAGES,
    name: "Manage pages."
  },
  {
    code: PermissionEnum.MANAGE_PRODUCTS,
    name: "Manage products."
  },
  {
    code: PermissionEnum.MANAGE_SETTINGS,
    name: "Manage settings."
  },
  {
    code: PermissionEnum.MANAGE_SHIPPING,
    name: "Manage shipping."
  },
  {
    code: PermissionEnum.MANAGE_STAFF,
    name: "Manage staff."
  },
  {
    code: PermissionEnum.MANAGE_USERS,
    name: "Manage customers."
  }
].map(perm => ({
  __typename: "PermissionDisplay" as "PermissionDisplay",
  ...perm
}));
