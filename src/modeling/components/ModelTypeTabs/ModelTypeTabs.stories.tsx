import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { getGroupTabId } from "./groupModelTypeTabs";
import { ALL_MODELS_TAB_ID, ModelTypeTabs } from "./ModelTypeTabs";

const samplePageTypes = [
  { id: "pt-1", name: "Article" },
  { id: "pt-2", name: "Author" },
  { id: "pt-3", name: "FAQ" },
  { id: "pt-4", name: "Landing Page" },
  { id: "pt-5", name: "Legal" },
];

const groupedPageTypes = [
  { id: "pt-article", name: "Article" },
  { id: "pt-cart", name: "Storefront — Cart" },
  { id: "pt-checkout", name: "Storefront — Checkout" },
  { id: "pt-chrome", name: "Storefront — Chrome" },
  { id: "pt-homepage", name: "Storefront — Homepage" },
  { id: "pt-legal", name: "Legal" },
];

const storefrontGroupId = getGroupTabId("Storefront");

const meta: Meta<typeof ModelTypeTabs> = {
  title: "Modeling/ModelTypeTabs",
  component: ModelTypeTabs,
  parameters: STORYBOOK_CHROMATIC_PARAMS,
  args: {
    onTabChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ModelTypeTabs>;

export const AllTabActive: Story = {
  args: {
    pageTypes: samplePageTypes,
    selectedIds: [],
    counts: {
      [ALL_MODELS_TAB_ID]: { value: 20, hasMore: true },
      "pt-1": { value: 12, hasMore: false },
      "pt-2": { value: 5, hasMore: false },
      "pt-3": { value: 20, hasMore: true },
      "pt-4": { value: 0, hasMore: false },
      "pt-5": { value: 3, hasMore: false },
    },
  },
};

export const SpecificTypeActive: Story = {
  args: {
    pageTypes: samplePageTypes,
    selectedIds: ["pt-3"],
    counts: {
      [ALL_MODELS_TAB_ID]: { value: 20, hasMore: true },
      "pt-1": { value: 12, hasMore: false },
      "pt-3": { value: 20, hasMore: true },
    },
  },
};

export const GroupedTypesAllActive: Story = {
  args: {
    pageTypes: groupedPageTypes,
    selectedIds: ["pt-cart", "pt-checkout", "pt-chrome", "pt-homepage"],
    counts: {
      [ALL_MODELS_TAB_ID]: { value: 20, hasMore: true },
      [storefrontGroupId]: { value: 4, hasMore: false },
      "pt-cart": { value: 1, hasMore: false },
      "pt-checkout": { value: 1, hasMore: false },
      "pt-chrome": { value: 1, hasMore: false },
      "pt-homepage": { value: 1, hasMore: false },
      "pt-article": { value: 2, hasMore: false },
      "pt-legal": { value: 1, hasMore: false },
    },
  },
};

export const GroupedSubtypeActive: Story = {
  args: {
    pageTypes: groupedPageTypes,
    selectedIds: ["pt-checkout"],
    counts: {
      [ALL_MODELS_TAB_ID]: { value: 20, hasMore: true },
      [storefrontGroupId]: { value: 4, hasMore: false },
      "pt-cart": { value: 1, hasMore: false },
      "pt-checkout": { value: 1, hasMore: false },
      "pt-chrome": { value: 1, hasMore: false },
      "pt-homepage": { value: 1, hasMore: false },
    },
  },
};

export const NoCountsYet: Story = {
  args: {
    pageTypes: samplePageTypes,
    selectedIds: [],
    counts: {},
  },
};

export const NoPageTypes: Story = {
  args: {
    pageTypes: [],
    selectedIds: [],
    counts: {
      [ALL_MODELS_TAB_ID]: { value: 0, hasMore: false },
    },
  },
};

export const Loading: Story = {
  args: {
    pageTypes: undefined,
    selectedIds: [],
    counts: {},
  },
};

const manyPageTypes = Array.from({ length: 25 }, (_, i) => ({
  id: `pt-many-${i + 1}`,
  name: `Model Type ${i + 1}`,
}));

const manyCounts: Record<string, { value: number; hasMore: boolean }> = {
  [ALL_MODELS_TAB_ID]: { value: 20, hasMore: true },
};

manyPageTypes.forEach((pt, i) => {
  manyCounts[pt.id] = { value: i + 1, hasMore: i % 3 === 0 };
});

export const ManyTypesOverflow: Story = {
  args: {
    pageTypes: manyPageTypes,
    selectedIds: [],
    counts: manyCounts,
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 700, border: "1px dashed #ccc" }}>
        <Story />
      </div>
    ),
  ],
};

export const ManyTypesActiveInOverflow: Story = {
  args: {
    pageTypes: manyPageTypes,
    selectedIds: ["pt-many-20"],
    counts: manyCounts,
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 700, border: "1px dashed #ccc" }}>
        <Story />
      </div>
    ),
  ],
};

export const ManyTypesNarrow: Story = {
  args: {
    pageTypes: manyPageTypes,
    selectedIds: [],
    counts: manyCounts,
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 400, border: "1px dashed #ccc" }}>
        <Story />
      </div>
    ),
  ],
};
