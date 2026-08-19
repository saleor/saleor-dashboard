import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { FixedAtCreationField } from "./FixedAtCreationField";

describe("FixedAtCreationField", () => {
  it("renders a disabled value with a lock and creation hint", () => {
    // Arrange & Act
    render(
      <FixedAtCreationField
        data-test-id="channel-currency-locked-input"
        helperText="Fixed at creation. To sell in another currency, create a second channel."
        label="Currency"
        name="currencyCode"
        value="USD"
      />,
      { wrapper: Wrapper },
    );

    // Assert
    const input = screen.getByLabelText("Currency");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("USD");
    expect(screen.getByTestId("channel-currency-locked-input")).toBeInTheDocument();
    expect(
      screen.getByText("Fixed at creation. To sell in another currency, create a second channel."),
    ).toBeInTheDocument();
  });
});
