import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react";

import { useMetadataForm } from "./useMetadataForm";

describe("useMetadataForm", () => {
  it("returns form values from hook form for metadata and privateMetadata", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" as const }],
      privateMetadata: [
        { key: "private-key", value: "private-value", __typename: "MetadataItem" as const },
      ],
    };

    // Act
    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    // Assert
    expect(result.current.metadataFields).toEqual([
      {
        key: "test-key",
        value: "test-value",
        id: expect.any(String),
      },
    ]);
    expect(result.current.privateMetadataFields).toEqual([
      {
        key: "private-key",
        value: "private-value",
        id: expect.any(String),
      },
    ]);
  });

  it("handles update action for metadata keys", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "old-key", value: "test-value", __typename: "MetadataItem" as const }],
      privateMetadata: [
        {
          key: "old-private-key",
          value: "private-test-value",
          __typename: "MetadataItem" as const,
        },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `metadata:0:${EventDataField.name}`,
        value: "new-key",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `privateMetadata:0:${EventDataField.name}`,
        value: "new-private-key",
      },
    };

    // Act
    act(() => {
      result.current.handleChange(metadataEvent, false);
      result.current.handleChange(privateMetadataEvent, true);
    });

    // Assert
    expect(result.current.formData.metadata[0]).toEqual({
      key: "new-key",
      value: "test-value",
    });
    expect(result.current.formData.privateMetadata[0]).toEqual({
      key: "new-private-key",
      value: "private-test-value",
    });
  });

  it("handles update action for metadata values", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test-key", value: "old-value", __typename: "MetadataItem" as const }],
      privateMetadata: [
        {
          key: "private-test-key",
          value: "old-private-value",
          __typename: "MetadataItem" as const,
        },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `metadata:0:${EventDataField.value}`,
        value: "new-value",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `privateMetadata:0:${EventDataField.value}`,
        value: "new-private-value",
      },
    };

    // Act
    act(() => {
      result.current.handleChange(metadataEvent, false);
      result.current.handleChange(privateMetadataEvent, true);
    });

    // Assert
    expect(result.current.formData.metadata[0]).toEqual({
      key: "test-key",
      value: "new-value",
    });
    expect(result.current.formData.privateMetadata[0]).toEqual({
      key: "private-test-key",
      value: "new-private-value",
    });
  });

  it("handles add action for metadata and privateMetadata", () => {
    // Arrange
    const graphqlData = {
      metadata: [],
      privateMetadata: [],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const event: ChangeEvent = {
      target: {
        name: EventDataAction.add,
        value: "",
      },
    };

    // Act
    act(() => {
      result.current.handleChange(event, false);
      result.current.handleChange(event, true);
    });

    // Assert
    expect(result.current.formData.metadata).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
    expect(result.current.formData.privateMetadata).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
  });

  it("handles delete action for metadata and privateMetadata", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test", value: "value", __typename: "MetadataItem" as const }],
      privateMetadata: [
        { key: "private-test", value: "private-value", __typename: "MetadataItem" as const },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const event: ChangeEvent = {
      target: {
        name: EventDataAction.delete,
        value: 0,
      },
    };

    // Act
    act(() => {
      result.current.handleChange(event, false);
      result.current.handleChange(event, true);
    });

    // Assert
    expect(result.current.formData.metadata).toEqual([]);
    expect(result.current.formData.privateMetadata).toEqual([]);
  });

  it("validates and rejects duplicate keys in metadata", async () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test", value: "value1", __typename: "MetadataItem" as const }],
      privateMetadata: [
        { key: "private-test", value: "private-value1", __typename: "MetadataItem" as const },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const eventAdd: ChangeEvent = {
      target: {
        name: EventDataAction.add,
        value: "",
      },
    };

    const metadataUpdate: ChangeEvent = {
      target: {
        name: `metadata:1:${EventDataField.name}`,
        value: "test",
      },
    };

    const privateMetadataUpdate: ChangeEvent = {
      target: {
        name: `privateMetadata:1:${EventDataField.name}`,
        value: "private-test",
      },
    };

    // Act
    await act(async () => {
      // Add
      result.current.handleChange(eventAdd, false);
      result.current.handleChange(eventAdd, true);

      // Update
      result.current.handleChange(metadataUpdate, false);
      result.current.handleChange(privateMetadataUpdate, true);
    });

    // Assert
    expect(result.current.metadataErrors).toContain(
      "Metadata keys must be unique, remove duplicate key",
    );
    expect(result.current.privateMetadataErrors).toContain(
      "Metadata keys must be unique, remove duplicate key",
    );
  });

  it("validates and rejects empty keys in metadata", async () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test", value: "value1", __typename: "MetadataItem" as const }],
      privateMetadata: [
        { key: "private-test", value: "private-value1", __typename: "MetadataItem" as const },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const eventAdd: ChangeEvent = {
      target: {
        name: EventDataAction.add,
        value: "",
      },
    };

    const metadataNoOpUpdate: ChangeEvent = {
      target: {
        name: `metadata:1:${EventDataField.name}`,
        value: "",
      },
    };

    const privateMetadataNoOpUpdate: ChangeEvent = {
      target: {
        name: `privateMetadata:1:${EventDataField.name}`,
        value: "",
      },
    };

    // Act
    await act(async () => {
      // Add empty fields
      result.current.handleChange(eventAdd, false);
      result.current.handleChange(eventAdd, true);

      // Trigger validation by updating the empty fields
      result.current.handleChange(metadataNoOpUpdate, false);
      result.current.handleChange(privateMetadataNoOpUpdate, true);
    });

    // Assert
    expect(result.current.metadataErrors).toContain("Metadata key cannot be empty");
    expect(result.current.privateMetadataErrors).toContain("Metadata key cannot be empty");
  });

  it("returns empty error arrays when there are no errors", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "valid-key", value: "value", __typename: "MetadataItem" as const }],
      privateMetadata: [
        { key: "valid-private-key", value: "private-value", __typename: "MetadataItem" as const },
      ],
    };

    // Act
    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    // Assert
    expect(result.current.metadataErrors).toEqual([]);
    expect(result.current.privateMetadataErrors).toEqual([]);
  });

  describe("when metadata is loaded again", () => {
    type GraphqlData = Parameters<typeof useMetadataForm>[0]["graphqlData"];
    type HookProps = Parameters<typeof useMetadataForm>[0];

    const item = (key: string, value: string) => ({
      key,
      value,
      __typename: "MetadataItem" as const,
    });
    const loadedFirst: GraphqlData = {
      metadata: [item("seller.legalName", "Example GmbH"), item("seller.vatId", "DE000000000")],
      privateMetadata: [],
    };
    const reloaded: GraphqlData = {
      metadata: [item("seller.legalName", "Example GmbH"), item("seller.vatId", "DE111111111")],
      privateMetadata: [],
    };
    const editLegalName: ChangeEvent = {
      target: { name: `metadata:0:${EventDataField.value}`, value: "Typed AG" },
    };

    const renderForm = (initialProps: HookProps) =>
      renderHook((props: HookProps) => useMetadataForm(props), { initialProps });

    it("keeps the user's edits after a save fails", () => {
      // Arrange
      const { result, rerender } = renderForm({
        graphqlData: loadedFirst,
        submitInProgress: false,
      });

      act(() => {
        result.current.handleChange(editLegalName, false);
      });

      // Act
      rerender({ graphqlData: loadedFirst, submitInProgress: true });
      rerender({ graphqlData: loadedFirst, submitInProgress: false });

      // Assert
      expect(result.current.formData.metadata[0]).toEqual({
        key: "seller.legalName",
        value: "Typed AG",
      });
      expect(result.current.formIsDirty).toBe(true);
    });

    it("leaves the form as the user edited it, and saves against what it was loaded with", () => {
      // Arrange
      const { result, rerender } = renderForm({
        graphqlData: loadedFirst,
        submitInProgress: false,
      });

      act(() => {
        result.current.handleChange(editLegalName, false);
      });

      // Act
      rerender({ graphqlData: reloaded, submitInProgress: false });

      // Assert
      expect(result.current.formData.metadata).toEqual([
        { key: "seller.legalName", value: "Typed AG" },
        { key: "seller.vatId", value: "DE000000000" },
      ]);
      expect(result.current.baseline?.metadata).toEqual([
        { key: "seller.legalName", value: "Example GmbH" },
        { key: "seller.vatId", value: "DE000000000" },
      ]);
      expect(result.current.formIsDirty).toBe(true);
    });

    it("shows the reloaded data when the user hasn't changed anything", () => {
      // Arrange
      const { result, rerender } = renderForm({
        graphqlData: loadedFirst,
        submitInProgress: false,
      });

      // Act
      rerender({ graphqlData: reloaded, submitInProgress: false });

      // Assert
      expect(result.current.formData.metadata[1]).toEqual({
        key: "seller.vatId",
        value: "DE111111111",
      });
      expect(result.current.baseline?.metadata[1].value).toBe("DE111111111");
      expect(result.current.formIsDirty).toBe(false);
    });

    it("drops edits made to another object when the form gets a different object's metadata", () => {
      // Arrange
      const variantA: GraphqlData = {
        id: "variant-a",
        metadata: [item("seller.legalName", "Example GmbH")],
        privateMetadata: [],
      };
      const variantB: GraphqlData = {
        id: "variant-b",
        metadata: [item("color", "red")],
        privateMetadata: [],
      };
      const { result, rerender } = renderForm({ graphqlData: variantA, submitInProgress: false });

      act(() => {
        result.current.handleChange(editLegalName, false);
      });

      // Act
      rerender({ graphqlData: variantB, submitInProgress: false });

      // Assert
      expect(result.current.formData.metadata).toEqual([{ key: "color", value: "red" }]);
      expect(result.current.baseline?.metadata).toEqual([{ key: "color", value: "red" }]);
      expect(result.current.formIsDirty).toBe(false);
    });

    it("can't be saved until metadata is loaded, then shows it", () => {
      // Arrange
      const { result, rerender } = renderForm({ graphqlData: undefined, submitInProgress: false });

      act(() => {
        result.current.handleChange({ target: { name: EventDataAction.add, value: "" } }, false);
      });

      const savableBeforeLoad = result.current.formIsDirty;

      // Act
      rerender({ graphqlData: loadedFirst, submitInProgress: false });

      // Assert
      expect(savableBeforeLoad).toBe(false);
      expect(result.current.formData.metadata).toHaveLength(2);
      expect(result.current.formIsDirty).toBe(false);
    });
  });

  it("resets form to initial values when reset is called", () => {
    // Arrange
    const graphqlData = {
      metadata: [
        { key: "initial-key", value: "initial-value", __typename: "MetadataItem" as const },
      ],
      privateMetadata: [
        {
          key: "initial-private-key",
          value: "initial-private-value",
          __typename: "MetadataItem" as const,
        },
      ],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    const updateEvent: ChangeEvent = {
      target: {
        name: `metadata:0:${EventDataField.value}`,
        value: "modified-value",
      },
    };

    // Act
    act(() => {
      result.current.handleChange(updateEvent, false);
    });

    // Assert - verify form was modified
    expect(result.current.formData.metadata[0].value).toBe("modified-value");

    // Act - reset form
    act(() => {
      result.current.reset();
    });

    // Assert - verify form was reset to initial values
    expect(result.current.formData.metadata[0].value).toBe("initial-value");
  });

  it("tracks formIsDirty state when form is modified", () => {
    // Arrange
    const graphqlData = {
      metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" as const }],
      privateMetadata: [],
    };

    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    // Assert - form starts as not dirty
    expect(result.current.formIsDirty).toBe(false);

    const updateEvent: ChangeEvent = {
      target: {
        name: `metadata:0:${EventDataField.value}`,
        value: "modified-value",
      },
    };

    // Act - modify form
    act(() => {
      result.current.handleChange(updateEvent, false);
    });

    // Assert - form becomes dirty after modification
    expect(result.current.formIsDirty).toBe(true);
  });

  it("handles undefined graphqlData gracefully", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData: undefined,
        submitInProgress: false,
      }),
    );

    // Assert
    expect(result.current.metadataFields).toEqual([]);
    expect(result.current.privateMetadataFields).toEqual([]);
    expect(result.current.formData.metadata).toEqual([]);
    expect(result.current.formData.privateMetadata).toEqual([]);
  });

  it("handles empty metadata arrays", () => {
    // Arrange
    const graphqlData = {
      metadata: [],
      privateMetadata: [],
    };

    // Act
    const { result } = renderHook(() =>
      useMetadataForm({
        graphqlData,
        submitInProgress: false,
      }),
    );

    // Assert
    expect(result.current.metadataFields).toEqual([]);
    expect(result.current.privateMetadataFields).toEqual([]);
    expect(result.current.formData.metadata).toEqual([]);
    expect(result.current.formData.privateMetadata).toEqual([]);
  });
});
