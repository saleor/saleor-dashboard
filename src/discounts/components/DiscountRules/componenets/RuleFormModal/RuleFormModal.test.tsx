import { MockedProvider } from "@apollo/client/testing";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { Condition, Rule } from "@dashboard/discounts/models";
import { ChannelFragment, RewardValueTypeEnum } from "@dashboard/graphql";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import {
  searchCategoriesMock,
  searchProductsMock,
  seatchCollectionMock,
  seatchVariantsMock,
} from "./mocks";
import { RuleFormModal } from "./RuleFormModal";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MockedProvider
      mocks={[
        searchCategoriesMock,
        seatchCollectionMock,
        searchProductsMock,
        seatchVariantsMock,
      ]}
    >
      <LegacyThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LegacyThemeProvider>
    </MockedProvider>
  );
};

describe("RuleFormModal", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    mockResizeObserver();
  });

  it("should prevent form submit when there are form error errors", async () => {
    // Arrange
    const onSubmit = jest.fn();

    render(
      <RuleFormModal
        channels={[]}
        confimButtonState="default"
        errors={[]}
        onClose={jest.fn()}
        open={true}
        onSubmit={onSubmit}
      />,
      { wrapper: Wrapper },
    );

    // Act
    userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should allow to create new Rule", async () => {
    // Arrange
    const onSubmit = jest.fn();

    render(
      <RuleFormModal
        channels={
          [
            {
              currencyCode: "$",
              id: "1",
              name: "PLN",
              slug: "PLN",
              isActive: true,
            },
          ] as ChannelFragment[]
        }
        confimButtonState="default"
        errors={[]}
        onClose={jest.fn()}
        open={true}
        onSubmit={onSubmit}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await userEvent.type(
      screen.getByRole("input", { name: "Name" }),
      "Name 123",
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByText(/pln/i)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });

    await userEvent.click(await screen.findByTestId(/rule-type/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/rule-value/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[0]);

    await userEvent.type(
      screen.getByRole("input", { name: "Discount value" }),
      "22",
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      id: "",
      name: "Name 123",
      channel: {
        label: "PLN",
        value: "1",
      },
      conditions: [
        {
          condition: "is",
          type: "product",
          values: [
            {
              label: "Bean Juice",
              value: "UHJvZHVjdDo3OQ==",
            },
          ],
        },
      ],
      description: "",
      rewardValue: 22,
      rewardValueType: "PERCENTAGE",
    });
  });

  it("should allow to update new Rule", async () => {
    // Arrange
    const onSubmit = jest.fn();

    render(
      <RuleFormModal
        channels={
          [
            {
              currencyCode: "$",
              id: "1",
              name: "PLN",
              slug: "PLN",
              isActive: true,
            },
          ] as ChannelFragment[]
        }
        confimButtonState="default"
        errors={[]}
        onClose={jest.fn()}
        open={true}
        onSubmit={onSubmit}
        initialFormValues={
          new Rule(
            "1",
            "Name 123",
            "",
            {
              label: "PLN",
              value: "1",
            },
            22,
            RewardValueTypeEnum.PERCENTAGE,
            [
              new Condition("product", "is", [
                {
                  label: "Bean Juice",
                  value: "UHJvZHVjdDo3OQ==",
                },
              ]),
            ],
          )
        }
      />,
      { wrapper: Wrapper },
    );

    // Act
    const nameField = screen.getByRole("input", { name: "Name" });
    await userEvent.clear(nameField);
    await userEvent.type(nameField, "New name");

    await userEvent.click(screen.getByRole("radio", { name: "$" }));

    const discountValueField = screen.getByRole("input", {
      name: "Discount value",
    });
    await userEvent.clear(discountValueField);
    await userEvent.type(discountValueField, "122");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      id: "1",
      name: "New name",
      channel: {
        label: "PLN",
        value: "1",
      },
      conditions: [
        {
          condition: "is",
          type: "product",
          values: [
            {
              label: "Bean Juice",
              value: "UHJvZHVjdDo3OQ==",
            },
          ],
        },
      ],
      description: "",
      rewardValue: 122,
      rewardValueType: "FIXED",
    });
  });
});
