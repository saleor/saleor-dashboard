import { ConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { action } from "storybook/actions";

import { ExpressionFilters } from "../AppLayout/ListFilters/components/ExpressionFilters";
import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { InitialProductStateResponse } from "./API/initialState/product/InitialProductStateResponse";
import { STATIC_PRODUCT_OPTIONS } from "./constants";
import { FilterContainer, FilterElement } from "./FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";
import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";
import { useContainerState } from "./useContainerState";
import { FilterWindow } from "./useFilterWindow";
import { UrlToken } from "./ValueProvider/UrlToken";

const MockAPIProvider: FilterAPIProvider = {
  fetchRightOptions: async (position, value, inputValue) => {
    action("fetchRightOptions")({ position, value, inputValue });

    return Promise.resolve([]);
  },
  fetchAttributeOptions: async inputValue => {
    action("fetchAttributeOptions")({ inputValue });

    return Promise.resolve([]);
  },
};

const MockLeftOperandsProvider: LeftOperandsProvider = {
  operands: STATIC_PRODUCT_OPTIONS,
  setOperands: () => { },
};

const MockValueProvider: FilterValueProvider = {
  value: [],
  loading: false,
  persist: () => { },
  isPersisted: () => false,
  clear: () => { },
  getTokenByName: () => undefined,
  count: 0,
};

const withMockedContext =
  (valueProvider: FilterValueProvider, apiProvider: FilterAPIProvider = MockAPIProvider) =>
    // eslint-disable-next-line react/display-name
    (Story: React.FC) => {
      const containerState = useContainerState(valueProvider);
      const filterWindow = {
        isOpen: true,
        setOpen: () => { },
      };

      return (
        <ConditionalFilterContext.Provider
          value={{
            apiProvider,
            valueProvider,
            leftOperandsProvider: MockLeftOperandsProvider,
            containerState: {
              ...containerState,
              clearEmpty: () => { },
            },
            filterWindow: filterWindow as FilterWindow,
          }}
        >
          <div style={{ maxWidth: 650, margin: "auto" }}>
            <Story />
          </div>
        </ConditionalFilterContext.Provider>
      );
    };

const meta: Meta<typeof ExpressionFilters> = {
  title: "ConditionalFilter",
  component: ExpressionFilters,
};

export default meta;
type Story = StoryObj<typeof ExpressionFilters>;

export const Default: Story = {
  decorators: [withMockedContext(MockValueProvider)],
};

export const WithSingleEmptyRow: Story = {
  decorators: [
    withMockedContext({
      ...MockValueProvider,
      value: [FilterElement.createEmpty()],
    }),
  ],
};

export const Loading: Story = {
  decorators: [
    withMockedContext({
      ...MockValueProvider,
      loading: true,
    }),
  ],
};

const prefilledValue: FilterContainer = [
  FilterElement.fromUrlToken(
    new UrlToken("channel", "channel-pln", "s", "is"),
    new InitialProductStateResponse([], {}, [
      { label: "Channel PLN", value: "channel-pln", slug: "channel-pln" },
    ]),
  ),
  "AND",
  FilterElement.fromUrlToken(
    new UrlToken("price", "123", "s", "is"),
    new InitialProductStateResponse(),
  ),
];

export const Prefilled: Story = {
  decorators: [
    withMockedContext({
      ...MockValueProvider,
      value: prefilledValue,
    }),
  ],
};

const withAttributeValue: FilterContainer = [
  FilterElement.fromUrlToken(
    new UrlToken("attribute", "", "s", "is"),
    new InitialProductStateResponse(),
  ),
];

const mockAttributes: LeftOperand[] = [
  {
    label: "Bottle Size (DROPDOWN)",
    value: "bottle-size",
    slug: "bottle-size",
    type: AttributeInputTypeEnum.DROPDOWN,
  },
  {
    label: "Color (MULTISELECT)",
    value: "color",
    slug: "color",
    type: AttributeInputTypeEnum.MULTISELECT,
  },
  {
    label: "Width (NUMERIC)",
    value: "width",
    slug: "width",
    type: AttributeInputTypeEnum.NUMERIC,
  },
  {
    label: "Published Date (DATE)",
    value: "published-date",
    slug: "published-date",
    type: AttributeInputTypeEnum.DATE,
  },
  {
    label: "Available At (DATE_TIME)",
    value: "available-at",
    slug: "available-at",
    type: AttributeInputTypeEnum.DATE_TIME,
  },
  {
    label: "Is Vintage (BOOLEAN)",
    value: "is-vintage",
    slug: "is-vintage",
    type: AttributeInputTypeEnum.BOOLEAN,
  },
  {
    label: "Designer (REFERENCE - PAGE)",
    value: "designer",
    slug: "designer",
    type: AttributeInputTypeEnum.REFERENCE,
    entityType: AttributeEntityTypeEnum.PAGE,
  },
  {
    label: "Pattern (SWATCH)",
    value: "pattern",
    slug: "pattern",
    type: AttributeInputTypeEnum.SWATCH,
  },
];

export const WithAttribute: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the attribute filter with a mocked API response.
When you click on the attribute selector, it will show all available mock attributes after a 1-second delay.
You can then test filtering this list by typing in the input.

**Available mock attributes:**
- Bottle Size (DROPDOWN)
- Color (MULTISELECT)
- Width (NUMERIC)
- Published Date (DATE)
- Available At (DATE_TIME)
- Is Vintage (BOOLEAN)
- Designer (REFERENCE - PAGE)
- Pattern (SWATCH)
`,
      },
    },
  },
  decorators: [
    withMockedContext(
      {
        ...MockValueProvider,
        value: withAttributeValue,
      },
      {
        ...MockAPIProvider,
        fetchAttributeOptions: async (inputValue: string) => {
          action("fetchAttributeOptions")({ inputValue });
          await new Promise(resolve => setTimeout(resolve, 1000));

          if (inputValue === "") {
            return Promise.resolve(mockAttributes);
          }

          return Promise.resolve(
            mockAttributes.filter(attr =>
              attr.label.toLowerCase().includes(inputValue.toLowerCase()),
            ),
          );
        },
        fetchRightOptions: async (position, value, inputValue) => {
          action("fetchRightOptions")({ position, value, inputValue });

          return Promise.resolve([
            { label: "0.5l", value: "0-5l", slug: "0-5l" },
            { label: "1l", value: "1l", slug: "1l" },
            { label: "1.5l", value: "1-5l", slug: "1-5l" },
          ]);
        },
      },
    ),
  ],
};
