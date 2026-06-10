import {
  type GiftCardsListConsumerProps,
  GiftCardsListContext,
} from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider/GiftCardListProvider";
import { GiftCardUrlSortField } from "@dashboard/giftCards/GiftCardsList/types";
import { type ExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { type GiftCardListQuery } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";

type GiftCardNode = ExtendedGiftCard<
  NonNullable<GiftCardListQuery["giftCards"]>["edges"][0]["node"]
>;

const mockGiftCards: GiftCardNode[] = [
  {
    __typename: "GiftCard" as const,
    id: "gift-1",
    last4CodeChars: "AB12",
    isActive: true,
    expiryDate: null,
    isExpired: false,
    tags: [{ __typename: "GiftCardTag" as const, name: "VIP" }],
    product: {
      __typename: "Product" as const,
      id: "prod-1",
      name: "Gift Card $50",
    },
    usedBy: {
      __typename: "User" as const,
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
    },
    usedByEmail: "john@example.com",
    currentBalance: {
      __typename: "Money" as const,
      amount: 50,
      currency: "USD",
    },
  },
  {
    __typename: "GiftCard" as const,
    id: "gift-2",
    last4CodeChars: "CD34",
    isActive: false,
    expiryDate: "2024-01-01",
    isExpired: true,
    tags: [],
    product: null,
    usedBy: null,
    usedByEmail: null,
    currentBalance: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
  },
  {
    __typename: "GiftCard" as const,
    id: "gift-3",
    last4CodeChars: "EF56",
    isActive: true,
    expiryDate: "2099-12-31",
    isExpired: false,
    tags: [
      { __typename: "GiftCardTag" as const, name: "Holiday" },
      { __typename: "GiftCardTag" as const, name: "Promo" },
    ],
    product: {
      __typename: "Product" as const,
      id: "prod-2",
      name: "Gift Card $100",
    },
    usedBy: {
      __typename: "User" as const,
      id: "user-2",
      firstName: "Jane",
      lastName: "Smith",
    },
    usedByEmail: "jane@example.com",
    currentBalance: {
      __typename: "Money" as const,
      amount: 75,
      currency: "USD",
    },
  },
];

const defaultContextValue: GiftCardsListConsumerProps = {
  loading: false,
  giftCards: mockGiftCards,
  settings: {
    columns: ["giftCardCode", "tag", "product", "usedBy", "balance"],
    rowNumber: 20,
  },
  updateListSettings: fn(),
  selectedRowIds: [],
  setSelectedRowIds: fn(),
  setClearDatagridRowSelectionCallback: fn(),
  clearRowSelection: fn(),
  sort: { sort: GiftCardUrlSortField.usedBy, asc: true },
  onSort: fn(),
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: null,
    startCursor: null,
  },
  paginationState: { first: 20 },
  params: {},
  numberOfColumns: 7,
  totalCount: mockGiftCards.length,
  changeFilters: fn(),
  resetFilters: fn(),
  handleSearchChange: fn(),
  isFilterPresetOpen: false,
  setFilterPresetOpen: fn(),
  presets: [],
  selectedPreset: 0,
  onPresetChange: fn(),
  onPresetDelete: fn(),
  onPresetSave: fn(),
  onPresetUpdate: fn(),
  setPresetIdToDelete: fn(),
  presetIdToDelete: null,
  hasPresetsChanged: fn().mockReturnValue(false),
  getPresetNameToDelete: fn().mockReturnValue(""),
};

const MockGiftCardListProvider = ({
  children,
  value,
}: {
  children: ReactElement;
  value: GiftCardsListConsumerProps;
}) => <GiftCardsListContext.Provider value={value}>{children}</GiftCardsListContext.Provider>;

const meta: Meta<typeof GiftCardsListDatagrid> = {
  title: "GiftCards/GiftCardsListDatagrid",
  component: GiftCardsListDatagrid,

  decorators: [
    (Story: React.ComponentType) => (
      <MockGiftCardListProvider value={defaultContextValue}>
        <Story />
      </MockGiftCardListProvider>
    ),
  ],
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof GiftCardsListDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <MockGiftCardListProvider value={{ ...defaultContextValue, loading: true, giftCards: [] }}>
        <Story />
      </MockGiftCardListProvider>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Empty: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <MockGiftCardListProvider value={{ ...defaultContextValue, giftCards: [], totalCount: 0 }}>
        <Story />
      </MockGiftCardListProvider>
    ),
  ],
};
