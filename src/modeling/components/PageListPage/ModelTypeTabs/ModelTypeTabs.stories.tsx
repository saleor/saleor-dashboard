import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { MemoryRouter } from "react-router-dom";
import { fn } from "storybook/test";

import { type ModelType } from "./computeVisibleTypes";
import { ModelTypeTabs } from "./ModelTypeTabs";

const fewTypes: ModelType[] = [
  { id: "pt-1", name: "Brand" },
  { id: "pt-2", name: "Refund Reason" },
  { id: "pt-3", name: "Lector" },
];

const fewCounts: Record<string, number> = {
  "pt-1": 5,
  "pt-2": 6,
  "pt-3": 5,
};

const manyTypes: ModelType[] = [
  { id: "pt-1", name: "Refund Reason" },
  { id: "pt-2", name: "Brand" },
  { id: "pt-3", name: "Lector" },
  { id: "pt-4", name: "Simple" },
  { id: "pt-5", name: "Blog Post" },
  { id: "pt-6", name: "FAQ" },
  { id: "pt-7", name: "Testimonial" },
  { id: "pt-8", name: "Store Location" },
  { id: "pt-9", name: "Career" },
  { id: "pt-10", name: "Event" },
  { id: "pt-11", name: "Press Release" },
  { id: "pt-12", name: "Landing Page" },
];

const manyCounts: Record<string, number> = {
  "pt-1": 6,
  "pt-2": 5,
  "pt-3": 5,
  "pt-4": 4,
  "pt-5": 4,
  "pt-6": 4,
  "pt-7": 3,
  "pt-8": 3,
  "pt-9": 3,
  "pt-10": 2,
  "pt-11": 1,
  "pt-12": 1,
};

const meta: Meta<typeof ModelTypeTabs> = {
  title: "Modeling/ModelTypeTabs",
  component: ModelTypeTabs,
  decorators: [
    (Story: ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    onChange: fn(),
    onTogglePin: fn(),
    onOverflowOpen: fn(),
    activeType: null,
    pinnedTypeIds: [],
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof ModelTypeTabs>;

export const FewTypes: Story = {
  args: {
    types: fewTypes,
    counts: fewCounts,
    totalCount: 16,
  },
};

export const FewTypesActive: Story = {
  args: {
    types: fewTypes,
    counts: fewCounts,
    totalCount: 16,
    activeType: "pt-1",
  },
};

export const ManyTypesOverflow: Story = {
  args: {
    types: manyTypes,
    counts: manyCounts,
    totalCount: 41,
  },
};

export const ManyTypesActiveInOverflow: Story = {
  args: {
    types: manyTypes,
    counts: manyCounts,
    totalCount: 41,
    activeType: "pt-11",
  },
};

export const Loading: Story = {
  args: {
    types: [],
    counts: {},
    totalCount: undefined,
    loading: true,
  },
};

export const NoTypes: Story = {
  args: {
    types: [],
    counts: {},
    totalCount: 0,
    emptyTypesUrl: "/model-types/add",
  },
};

export const CountsStillLoading: Story = {
  args: {
    types: fewTypes,
    counts: {},
    totalCount: undefined,
  },
};

export const WithPinnedTypes: Story = {
  args: {
    types: manyTypes,
    counts: manyCounts,
    totalCount: 41,
    // "Refund Reason" + "Career" pinned (in pin order). They appear right
    // after the "All" tab, before the alphabetical fillers.
    pinnedTypeIds: ["pt-1", "pt-9"],
  },
};

export const PinnedExceedsSlotBudget: Story = {
  args: {
    types: manyTypes,
    counts: manyCounts,
    totalCount: 41,
    // 7 pinned types — pinned always wins, so they all stay visible even though
    // visibleSlots defaults to 6.
    pinnedTypeIds: ["pt-1", "pt-2", "pt-3", "pt-4", "pt-5", "pt-6", "pt-7"],
  },
};
