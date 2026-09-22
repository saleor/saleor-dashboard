import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonGroupWithDropdown } from "./ButtonGroupWithDropdown";

describe("ButtonGroupWithDropdown", () => {
  it("pins first-party actions above extensions with a separator", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ButtonGroupWithDropdown
        onClick={jest.fn()}
        testId="create-entity"
        pinnedOptions={[{ label: "Create type", testId: "create-type", onSelect: jest.fn() }]}
        options={[{ label: "Import from app", testId: "extension-import", onSelect: jest.fn() }]}
      >
        Create
      </ButtonGroupWithDropdown>,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByTestId("create-entity-dropdown"));

    // Assert
    const typeItem = screen.getByTestId("create-type");
    const extensionItem = screen.getByTestId("extension-import");
    const separator = screen.getByRole("separator");

    expect(typeItem.compareDocumentPosition(separator) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(
      separator.compareDocumentPosition(extensionItem) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("does not render a separator when there are no extension actions", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ButtonGroupWithDropdown
        onClick={jest.fn()}
        testId="create-entity"
        pinnedOptions={[{ label: "Create type", testId: "create-type", onSelect: jest.fn() }]}
        options={[]}
      >
        Create
      </ButtonGroupWithDropdown>,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByTestId("create-entity-dropdown"));

    // Assert
    expect(screen.getByTestId("create-type")).toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
