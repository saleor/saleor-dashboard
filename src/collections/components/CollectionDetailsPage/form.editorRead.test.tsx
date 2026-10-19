import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { collection as collectionFixture } from "@dashboard/collections/fixtures";
import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { type CollectionDetailsFragment } from "@dashboard/graphql";
import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";

import { type CollectionUpdateData, useCollectionUpdateForm } from "./form";

const description: OutputData = {
  blocks: [{ type: "paragraph", data: { text: "Edited summary" } }],
};
const fullDescription: OutputData = {
  blocks: [{ type: "paragraph", data: { text: "Edited full description" } }],
};
const emptyDescription: OutputData = { blocks: [] };
const fixture = collectionFixture("collection.jpg", "product.jpg");

if (!fixture) {
  throw new Error("Expected collection fixture");
}

const collection: CollectionDetailsFragment = {
  ...fixture,
  description: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Saved summary" } }] }),
  fullDescription: JSON.stringify({
    blocks: [{ type: "paragraph", data: { text: "Saved full description" } }],
  }),
};

const channels: ChannelCollectionData[] = [];

const Wrapper = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={["/collection"]}>
    <ThemeProvider>
      <ExitFormDialogProvider>{children}</ExitFormDialogProvider>
    </ThemeProvider>
  </MemoryRouter>
);

const createEditor = (save: () => Promise<OutputData>): EditorCore => ({
  save,
  destroy: jest.fn(),
  clear: jest.fn(),
  render: jest.fn(),
  dangerouslyLowLevelInstance: {},
});

const readFailureFields: Array<"description" | "fullDescription"> = [
  "description",
  "fullDescription",
];

const createPendingRead = (): {
  promise: Promise<OutputData>;
  resolve: (value: OutputData) => void;
} => {
  let resolveRead: (value: OutputData) => void = () => undefined;
  const promise = new Promise<OutputData>(resolve => {
    resolveRead = resolve;
  });

  return { promise, resolve: resolveRead };
};

describe("useCollectionUpdateForm editor read failures", () => {
  it.each(readFailureFields)(
    "keeps both rich drafts protected after %s rejects and includes them in a retry",
    async failingField => {
      // Arrange
      const readError = new Error("Cannot read editor");
      const descriptionSave = jest.fn<Promise<OutputData>, []>().mockResolvedValue(description);
      const fullDescriptionSave = jest
        .fn<Promise<OutputData>, []>()
        .mockResolvedValue(fullDescription);
      const failingSave = failingField === "description" ? descriptionSave : fullDescriptionSave;

      failingSave.mockRejectedValueOnce(readError);

      const onSubmit = jest.fn(async (_data: CollectionUpdateData): Promise<unknown[]> => []);
      const { result } = renderHook(
        () => useCollectionUpdateForm(collection, channels, channels, jest.fn(), onSubmit, false),
        { wrapper: Wrapper },
      );

      result.current.richText.editorRef.current = createEditor(descriptionSave);
      result.current.fullDescriptionRichText.editorRef.current = createEditor(fullDescriptionSave);
      act(() => {
        result.current.richText.handleChange();
        result.current.fullDescriptionRichText.handleChange();
      });
      expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(false);

      // Act
      await act(async () => {
        await expect(result.current.submit()).rejects.toThrow(readError);
      });

      const dirtyAfterFailure = {
        description: result.current.richText.isDirty,
        fullDescription: result.current.fullDescriptionRichText.isDirty,
      };
      const saveDisabledAfterFailure = result.current.isSaveDisabled;
      const unloadAllowedAfterFailure = window.dispatchEvent(
        new Event("beforeunload", { cancelable: true }),
      );

      act(() => {
        result.current.change({ target: { name: "name", value: "Retry collection" } });
      });
      await act(async () => {
        await result.current.submit();
      });

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({ name: "Retry collection", description, fullDescription }),
      );
      expect(dirtyAfterFailure).toEqual({ description: true, fullDescription: true });
      expect(saveDisabledAfterFailure).toBe(false);
      expect(unloadAllowedAfterFailure).toBe(false);
    },
  );

  it("retries a cleared full description after its editor read rejects", async () => {
    // Arrange
    const readError = new Error("Cannot read cleared editor");
    const fullDescriptionSave = jest
      .fn<Promise<OutputData>, []>()
      .mockRejectedValueOnce(readError)
      .mockResolvedValue(emptyDescription);
    const onSubmit = jest.fn(async (_data: CollectionUpdateData): Promise<unknown[]> => []);
    const { result } = renderHook(
      () => useCollectionUpdateForm(collection, channels, channels, jest.fn(), onSubmit, false),
      { wrapper: Wrapper },
    );

    result.current.richText.editorRef.current = createEditor(async () => description);
    result.current.fullDescriptionRichText.editorRef.current = createEditor(fullDescriptionSave);
    act(() => result.current.fullDescriptionRichText.handleChange());

    // Act
    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow(readError);
    });
    act(() => {
      result.current.change({ target: { name: "name", value: "Retry cleared collection" } });
    });
    await act(async () => {
      await result.current.submit();
    });

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ fullDescription: emptyDescription }),
    );
  });

  it.each(readFailureFields)(
    "keeps beforeunload protection while the only edited %s is being read",
    async pendingField => {
      // Arrange
      const pendingRead = createPendingRead();
      const descriptionSave = jest.fn<Promise<OutputData>, []>().mockResolvedValue(description);
      const fullDescriptionSave = jest
        .fn<Promise<OutputData>, []>()
        .mockResolvedValue(fullDescription);
      const pendingSave = pendingField === "description" ? descriptionSave : fullDescriptionSave;

      pendingSave.mockReturnValueOnce(pendingRead.promise);

      const onSubmit = jest.fn(async (_data: CollectionUpdateData): Promise<unknown[]> => []);
      const { result } = renderHook(
        () => useCollectionUpdateForm(collection, channels, channels, jest.fn(), onSubmit, false),
        { wrapper: Wrapper },
      );

      result.current.richText.editorRef.current = createEditor(descriptionSave);
      result.current.fullDescriptionRichText.editorRef.current = createEditor(fullDescriptionSave);
      act(() => {
        if (pendingField === "description") {
          result.current.richText.handleChange();
        } else {
          result.current.fullDescriptionRichText.handleChange();
        }
      });
      expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(false);

      // Act
      let submission: Promise<unknown[]> | undefined;

      await act(async () => {
        submission = result.current.submit();
        await Promise.resolve();
      });

      const unloadAllowedWhileReading = window.dispatchEvent(
        new Event("beforeunload", { cancelable: true }),
      );
      const submitCallsWhileReading = onSubmit.mock.calls.length;

      await act(async () => {
        pendingRead.resolve(pendingField === "description" ? description : fullDescription);
        await submission;
      });

      // Assert
      expect(submitCallsWhileReading).toBe(0);
      expect(unloadAllowedWhileReading).toBe(false);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    },
  );
});
