import { DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import {
  filterPresetsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import DiscountListPage, { DiscountListPageProps } from "./DiscountListPage";

const props: DiscountListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPresetsProps,
  settings: {
    ...pageListProps.default.settings,
    columns: ["name", "startDate", "endDate", "value"],
  },

  promotions: [],
  sort: {
    ...sortPageProps.sort,
    sort: DiscountListUrlSortField.name,
  },
};

const meta: Meta<typeof DiscountListPage> = {
  title: "Discounts / Sale list",
  decorators: [PaginatorContextDecorator],
  component: DiscountListPage,
};
export default meta;
type Story = StoryObj<typeof DiscountListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    promotions: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    promotions: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoChannels: Story = {
  args: {
    ...props,
    // promotions: saleList.map(sale => ({ ...sale, channelListings: [] })),
    promotions: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
