import { DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import { discountList } from "@dashboard/discounts/fixtures";
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
    columns: ["name", "startDate", "endDate"],
  },

  promotions: discountList,
  sort: {
    ...sortPageProps.sort,
    sort: DiscountListUrlSortField.name,
  },
};

const meta: Meta<typeof DiscountListPage> = {
  title: "Discounts / Discount list",
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
