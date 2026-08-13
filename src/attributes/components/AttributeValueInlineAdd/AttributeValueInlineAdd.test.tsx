import { AttributeInputTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AttributeValueInlineAdd } from "./AttributeValueInlineAdd";

const renderAdd = (
  overrides: Partial<Parameters<typeof AttributeValueInlineAdd>[0]> = {},
): ReturnType<typeof render> =>
  render(
    <AttributeValueInlineAdd
      columnSpan={4}
      disabled={false}
      error={null}
      hasRowsAbove={false}
      inputType={AttributeInputTypeEnum.DROPDOWN}
      onAdd={jest.fn()}
      variant="section"
      {...overrides}
    />,
    { wrapper: Wrapper },
  );

describe("AttributeValueInlineAdd paste", () => {
  it("shows a hint that lists can be pasted", () => {
    // Arrange
    renderAdd({ onAddMany: jest.fn() });

    // Assert
    expect(
      screen.getByText(/Paste from a spreadsheet or a comma-separated list/),
    ).toBeInTheDocument();
  });

  it("proposes splitting comma-separated paste into values", async () => {
    // Arrange
    const onAddMany = jest.fn();
    const user = userEvent.setup();

    renderAdd({ onAddMany });

    const input = screen.getByTestId("value-name");

    // Act
    await user.click(input);
    await user.paste("Italy, France, Germany");

    // Assert
    expect(screen.getByTestId("attribute-value-paste-proposal")).toBeInTheDocument();
    expect(screen.getByText(/Add 3 values from this paste/)).toBeInTheDocument();

    // Act
    await user.click(screen.getByTestId("attribute-value-paste-add"));

    // Assert
    expect(onAddMany).toHaveBeenCalledWith([
      { name: "Italy" },
      { name: "France" },
      { name: "Germany" },
    ]);
  });

  it("keeps the paste as one value when declined", async () => {
    // Arrange
    const onAddMany = jest.fn();
    const user = userEvent.setup();

    renderAdd({ onAddMany });

    // Act
    await user.click(screen.getByTestId("value-name"));
    await user.paste("Italy, France");
    await user.click(screen.getByTestId("attribute-value-paste-keep"));

    // Assert
    expect(onAddMany).not.toHaveBeenCalled();
    expect(screen.getByTestId("value-name")).toHaveValue("Italy, France");
    expect(screen.queryByTestId("attribute-value-paste-proposal")).not.toBeInTheDocument();
  });
});
