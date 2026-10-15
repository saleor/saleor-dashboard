import { collection as collectionFixture } from "@dashboard/collections/fixtures";
import {
  type CollectionDetailsFragment,
  CollectionErrorCode,
  type CollectionErrorFragment,
} from "@dashboard/graphql";
import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { act, renderHook } from "@testing-library/react";

import { type CollectionUpdateData, useCollectionUpdateForm } from "./form";

const description: OutputData = { blocks: [{ type: "paragraph", data: { text: "Summary" } }] };
const fullDescription: OutputData = { blocks: [{ type: "paragraph", data: { text: "Details" } }] };
const fixture = collectionFixture("collection.jpg", "product.jpg");

if (!fixture) {
  throw new Error("Expected collection fixture");
}

const collection: CollectionDetailsFragment = {
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

describe("useCollectionUpdateForm full description", () => {
  it("keeps the full description dirty after a failed save so it can be retried", async () => {
    // Arrange
    const errors: CollectionErrorFragment[] = [
      {
        __typename: "CollectionError",
        code: CollectionErrorCode.INVALID,
        field: "fullDescription",
        message: "Invalid full description",
      },
    ];
    const onSubmit = jest.fn(async (_data: CollectionUpdateData) => errors);
    const { result } = renderHook(() =>
      useCollectionUpdateForm(collection, [], [], jest.fn(), onSubmit, false),
    );

    result.current.richText.editorRef.current = createEditor(description);
    result.current.fullDescriptionRichText.editorRef.current = createEditor(fullDescription);

    // Act
    act(() => result.current.fullDescriptionRichText.handleChange());
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(result.current.fullDescriptionRichText.isDirty).toBe(true);
    expect(result.current.isSaveDisabled).toBe(false);

    // Act
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(onSubmit.mock.calls[1]?.[0].fullDescription).toEqual(fullDescription);
  });

  it("enables Save when only full description changes and preserves the description", async () => {
    // Arrange
    const onSubmit = jest.fn(
      async (_data: CollectionUpdateData): Promise<CollectionErrorFragment[]> => [],
    );
    const { result } = renderHook(() =>
      useCollectionUpdateForm(collection, [], [], jest.fn(), onSubmit, false),
    );

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
      async (_data: CollectionUpdateData): Promise<CollectionErrorFragment[]> => [],
    );
    const { result } = renderHook(() =>
      useCollectionUpdateForm(collection, [], [], jest.fn(), onSubmit, false),
    );

    result.current.richText.editorRef.current = createEditor(description);

    // Act
    act(() => result.current.change({ target: { name: "name", value: "Updated collection" } }));
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(onSubmit.mock.calls[0]?.[0]).not.toHaveProperty("fullDescription");
  });
});
