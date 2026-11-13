import { category as categoryFixture } from "@dashboard/categories/fixtures";
import { type CategoryDetailsFragment, type ProductErrorFragment } from "@dashboard/graphql";
import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { act, renderHook } from "@testing-library/react";

import { type CategoryUpdateData, useCategoryUpdateForm } from "./form";

const description: OutputData = { blocks: [{ type: "paragraph", data: { text: "Summary" } }] };
const fullDescription: OutputData = { blocks: [{ type: "paragraph", data: { text: "Details" } }] };
const fixture = categoryFixture("image.jpg");

if (!fixture) {
  throw new Error("Expected category fixture");
}

const category: CategoryDetailsFragment = {
  ...fixture,
  description: JSON.stringify(description),
  fullDescription: JSON.stringify(fullDescription),
};

const createEditor = (value: OutputData): EditorCore => ({
  save: jest.fn(async () => value),
  destroy: jest.fn(),
  clear: jest.fn(),
  render: jest.fn(),
  dangerouslyLowLevelInstance: {},
});

describe("useCategoryUpdateForm full description", () => {
  it("enables Save when only full description changes and preserves the description", async () => {
    // Arrange
    const onSubmit = jest.fn(
      async (_data: CategoryUpdateData): Promise<ProductErrorFragment[]> => [],
    );
    const { result } = renderHook(() => useCategoryUpdateForm(category, onSubmit, false));

    result.current.richText.editorRef.current = createEditor(description);
    result.current.fullDescriptionRichText.editorRef.current = createEditor(fullDescription);
    expect(result.current.isSaveDisabled).toBe(true);

    // Act
    act(() => result.current.fullDescriptionRichText.handleChange());

    // Assert
    expect(result.current.isSaveDisabled).toBe(false);
    expect(result.current.saveComposition.hasGeneral).toBe(true);

    // Act
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ description, fullDescription }),
    );
  });

  it("omits an unchanged full description from the update", async () => {
    // Arrange
    const onSubmit = jest.fn(
      async (_data: CategoryUpdateData): Promise<ProductErrorFragment[]> => [],
    );
    const { result } = renderHook(() => useCategoryUpdateForm(category, onSubmit, false));

    result.current.richText.editorRef.current = createEditor(description);

    // Act
    act(() => result.current.change({ target: { name: "name", value: "Updated category" } }));
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(onSubmit.mock.calls[0]?.[0]).not.toHaveProperty("fullDescription");
  });
});
