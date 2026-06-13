import { createCmdEnterSubmitHandler, isCmdEnter } from "./cmdEnterSubmit";

describe("isCmdEnter", () => {
  it("returns true for meta+Enter", () => {
    // Arrange
    const event = { metaKey: true, ctrlKey: false, key: "Enter" };

    // Act & Assert
    expect(isCmdEnter(event)).toBe(true);
  });

  it("returns true for ctrl+Enter", () => {
    // Arrange
    const event = { metaKey: false, ctrlKey: true, key: "Enter" };

    // Act & Assert
    expect(isCmdEnter(event)).toBe(true);
  });

  it("returns false for plain Enter", () => {
    // Arrange
    const event = { metaKey: false, ctrlKey: false, key: "Enter" };

    // Act & Assert
    expect(isCmdEnter(event)).toBe(false);
  });
});

describe("createCmdEnterSubmitHandler", () => {
  it("submits on cmd+Enter when enabled", () => {
    // Arrange
    const submit = jest.fn();
    const handler = createCmdEnterSubmitHandler(submit);
    const event = {
      metaKey: true,
      ctrlKey: false,
      key: "Enter",
      preventDefault: jest.fn(),
    };

    // Act
    handler(event);

    // Assert
    expect(event.preventDefault).toHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
  });

  it("does not submit when disabled", () => {
    // Arrange
    const submit = jest.fn();
    const handler = createCmdEnterSubmitHandler(submit, false);
    const event = {
      metaKey: true,
      ctrlKey: false,
      key: "Enter",
      preventDefault: jest.fn(),
    };

    // Act
    handler(event);

    // Assert
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });
});
