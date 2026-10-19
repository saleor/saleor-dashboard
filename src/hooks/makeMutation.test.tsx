import { gql } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  type CategoryUpdateData,
  useCategoryUpdateForm,
} from "@dashboard/categories/components/CategoryUpdatePage/form";
import { category as categoryFixture } from "@dashboard/categories/fixtures";
import { type CategoryDetailsFragment } from "@dashboard/graphql";
import { extractMutationErrors } from "@dashboard/misc";
import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { act, renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";

import { useMutation } from "./makeMutation";

const mockNotify = jest.fn();

jest.mock("./useNotifier/useNotifier", () => ({
  useNotifier: (): typeof mockNotify => mockNotify,
}));

interface SaveResult {
  update: { errors: Array<{ field: string; message: string }> };
}

interface SaveVariables {
  input: CategoryUpdateData;
}

const mutation = gql`
  mutation SaveDetails($input: CategoryInput!) {
    update: categoryUpdate(id: "category-id", input: $input) {
      errors {
        field
        message
      }
    }
  }
`;

const description: OutputData = { blocks: [{ type: "paragraph", data: { text: "Summary" } }] };
const fullDescription: OutputData = {
  blocks: [{ type: "paragraph", data: { text: "Unsaved details" } }],
};
const fixture = categoryFixture("category.jpg");

if (!fixture) {
  throw new Error("Expected category fixture");
}

const category: CategoryDetailsFragment = {
  ...fixture,
  description: JSON.stringify(description),
  fullDescription: null,
};
const input: CategoryUpdateData = {
  name: category.name,
  slug: category.slug,
  seoTitle: category.seoTitle ?? "",
  seoDescription: category.seoDescription ?? "",
  backgroundImageAlt: category.backgroundImage?.alt ?? "",
  description,
  fullDescription,
};
const variables: SaveVariables = { input };
const createEditor = (value: OutputData): EditorCore => ({
  save: jest.fn(async () => value),
  destroy: jest.fn(),
  clear: jest.fn(),
  render: jest.fn(),
  dangerouslyLowLevelInstance: {},
});

describe("useMutation transport errors", () => {
  beforeEach(() => jest.clearAllMocks());

  it("keeps a failed full-description save dirty and submits the draft on retry", async () => {
    // Arrange
    const onCompleted = jest.fn();
    const mocks: MockedResponse<SaveResult>[] = [
      { request: { query: mutation, variables }, error: new Error("Connection lost") },
      { request: { query: mutation, variables }, result: { data: { update: { errors: [] } } } },
    ];
    const Wrapper = ({ children }: PropsWithChildren): JSX.Element => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );
    const { result } = renderHook(
      () => {
        const [save, opts] = useMutation<SaveResult, SaveVariables>(mutation, { onCompleted });
        const form = useCategoryUpdateForm(
          category,
          data => extractMutationErrors(save({ variables: { input: data } })),
          opts.loading,
        );

        return { form, opts };
      },
      { wrapper: Wrapper },
    );

    result.current.form.richText.editorRef.current = createEditor(description);
    result.current.form.fullDescriptionRichText.editorRef.current = createEditor(fullDescription);

    // Act
    act(() => result.current.form.fullDescriptionRichText.handleChange());
    await act(async () => {
      const errors = await result.current.form.submit();

      // Assert
      expect(errors).toEqual([expect.objectContaining({ message: "Connection lost" })]);
    });

    // Assert
    expect(result.current.form.fullDescriptionRichText.isDirty).toBe(true);
    expect(result.current.form.isSaveDisabled).toBe(false);
    expect(result.current.opts.status).toBe("error");
    expect(onCompleted).not.toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));

    // Act
    await act(async () => {
      const errors = await result.current.form.submit();

      // Assert
      expect(errors).toEqual([]);
    });

    // Assert
    expect(result.current.form.isSaveDisabled).toBe(true);
    expect(result.current.opts.status).toBe("success");
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });
});
