import { useTranslationSaveState } from "./useTranslationSaveState";

describe("useTranslationSaveState", () => {
  it("returns loading state when query is loading", () => {
    // Act
    const result = useTranslationSaveState(true);

    // Assert
    expect(result).toEqual({
      disabled: true,
      saveButtonState: "default",
    });
  });

  it("returns loading save state when a mutation is loading", () => {
    // Act
    const result = useTranslationSaveState(false, {
      called: false,
      loading: true,
      status: "default",
    });

    // Assert
    expect(result).toEqual({
      disabled: true,
      saveButtonState: "loading",
    });
  });

  it("combines multiple mutation results", () => {
    // Act
    const result = useTranslationSaveState(
      false,
      {
        called: true,
        loading: false,
        status: "success",
        data: { categoryTranslate: { errors: [] } },
      },
      {
        called: true,
        loading: false,
        status: "default",
        data: { attributeValueTranslate: { errors: [{ message: "Invalid" }] } },
      },
    );

    // Assert
    expect(result.disabled).toBe(false);
    expect(result.saveButtonState).toBe("error");
  });
});
