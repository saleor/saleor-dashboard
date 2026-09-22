import { AttributeInputTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AttributeValueEditDialog } from "./AttributeValueEditDialog";

const renderDialog = (
  overrides: Partial<Parameters<typeof AttributeValueEditDialog>[0]> = {},
): ReturnType<typeof render> =>
  render(
    <AttributeValueEditDialog
      attributeValue={null}
      confirmButtonState="default"
      disabled={false}
      errors={[]}
      inputType={AttributeInputTypeEnum.DROPDOWN}
      open={true}
      onClose={jest.fn()}
      onSubmit={jest.fn()}
      {...overrides}
    />,
    { wrapper: Wrapper },
  );

describe("AttributeValueEditDialog paste", () => {
  it("shows a hint that lists can be pasted when adding values", () => {
    // Arrange
    renderDialog({ onSubmitMany: jest.fn() });

    // Assert
    expect(
      screen.getByText(/Paste from a spreadsheet or a comma-separated list/),
    ).toBeInTheDocument();
  });

  it("does not show the paste hint when editing a value", () => {
    // Arrange
    renderDialog({
      attributeValue: { name: "Italy" },
      onSubmitMany: jest.fn(),
    });

    // Assert
    expect(
      screen.queryByText(/Paste from a spreadsheet or a comma-separated list/),
    ).not.toBeInTheDocument();
  });

  it("proposes splitting comma-separated paste into values", async () => {
    // Arrange
    const onSubmitMany = jest.fn();
    const user = userEvent.setup();

    renderDialog({ onSubmitMany });

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
    expect(onSubmitMany).toHaveBeenCalledWith([
      { name: "Italy" },
      { name: "France" },
      { name: "Germany" },
    ]);
  });

  it("saves pasted values from the dialog submit button", async () => {
    // Arrange
    const onSubmitMany = jest.fn();
    const user = userEvent.setup();

    renderDialog({ onSubmitMany });

    // Act
    await user.click(screen.getByTestId("value-name"));
    await user.paste("Italy, France");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmitMany).toHaveBeenCalledWith([{ name: "Italy" }, { name: "France" }]);
  });

  it("keeps the paste as one value when declined", async () => {
    // Arrange
    const onSubmitMany = jest.fn();
    const user = userEvent.setup();

    renderDialog({ onSubmitMany });

    // Act
    await user.click(screen.getByTestId("value-name"));
    await user.paste("Italy, France");
    await user.click(screen.getByTestId("attribute-value-paste-keep"));

    // Assert
    expect(onSubmitMany).not.toHaveBeenCalled();
    expect(screen.getByTestId("value-name")).toHaveValue("Italy, France");
    expect(screen.queryByTestId("attribute-value-paste-proposal")).not.toBeInTheDocument();
  });

  it("does not nest a form when opened inside a page form", () => {
    // Arrange
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    // Act
    render(
      <form>
        <AttributeValueEditDialog
          attributeValue={null}
          confirmButtonState="default"
          disabled={false}
          errors={[]}
          inputType={AttributeInputTypeEnum.DROPDOWN}
          open={true}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
          onSubmitMany={jest.fn()}
        />
      </form>,
      { wrapper: Wrapper },
    );

    // Assert
    expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(
      /<form> cannot appear as a descendant of <form>/,
    );

    consoleError.mockRestore();
  });
});
