import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { DiscountRules } from "./DiscountRules";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

describe("DiscountRules", () => {
  it("should render placeholder when no rules", () => {
    // Arrange & Act
    render(<DiscountRules rules={[]} onRuleAdd={jest.fn()} />);

    // Assert
    expect(
      screen.getByText(/add your first rule to set up a promotion/i),
    ).toBeInTheDocument();
  });

  it("should render discount rules", () => {
    // Arrange & Act
    render(
      <DiscountRules
        rules={[
          {
            id: "Catalog rule 2",
            name: "Catalog rule 2",
            description: "",
          },
        ]}
        onRuleAdd={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText(/catalog rule/i)).toBeInTheDocument();
  });

  it("should fire callback when user whant to add new rule", async () => {
    // Arrange
    const onRuleAdd = jest.fn();
    render(<DiscountRules rules={[]} onRuleAdd={onRuleAdd} />);

    // Act
    await act(() => {
      userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/^catalog$/i)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByText(/^catalog$/i));
    });

    // Assert
    expect(onRuleAdd).toHaveBeenCalled();
  });
});
