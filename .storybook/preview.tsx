import "@saleor/macaw-ui-next/style";

import type { Decorator, Preview } from "@storybook/react";
import React from "react";
import { MockedProvidersDecorator } from "./decorators";

export const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators: Decorator[] = [
  Story => (
    <MockedProvidersDecorator>
      <Story />
    </MockedProvidersDecorator>
  ),
];
