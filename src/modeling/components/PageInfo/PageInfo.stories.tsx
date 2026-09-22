import { PageErrorCode } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactNode } from "react";
import { fn } from "storybook/test";

import { type PageData } from "../PageDetailsPage/form";
import PageInfo from "./PageInfo";

const baseData: PageData = {
  attributes: [],
  content: { blocks: [] },
  isPublished: true,
  metadata: [],
  pageType: {
    __typename: "PageType",
    id: "page-type-1",
    name: "Landing page",
    metadata: [],
    attributes: [],
  },
  privateMetadata: [],
  publishedAt: "2026-01-12",
  seoDescription: "",
  seoTitle: "",
  slug: "about-us",
  title: "About us",
};

// PageInfo renders a RichTextEditor that reads from RichTextContext.
const WithRichText = ({ children }: { children: ReactNode }) => {
  const richText = useRichText({ initial: null, loading: false, triggerChange: fn() });

  return <RichTextContext.Provider value={richText}>{children}</RichTextContext.Provider>;
};

const meta: Meta<typeof PageInfo> = {
  title: "Modeling/PageInfo",
  component: PageInfo,
  decorators: [
    (Story: StoryFn) => (
      <WithRichText>
        <Box __maxWidth="720px" padding={4}>
          <Story />
        </Box>
      </WithRichText>
    ),
  ],
  args: {
    data: baseData,
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PageInfo>;

export const Default: Story = {};

export const Empty: Story = { args: { data: { ...baseData, title: "" } } };

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: {
    data: { ...baseData, title: "" },
    errors: [
      {
        __typename: "PageError",
        code: PageErrorCode.REQUIRED,
        field: "title",
        message: "Title is required",
      },
    ],
  },
};
