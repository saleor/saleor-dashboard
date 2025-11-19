import { MetadataFormData } from "@dashboard/components/Metadata";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { useMetadataFormControls } from "./useMetadataFormControls";

describe("useMetadataFormControls", () => {
  describe("flat structure (no pathPrefix)", () => {
    it("returns form values from hook form for metadata and privateMetadata", () => {
      // Arrange
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test-key", value: "test-value" }],
            privateMetadata: [{ key: "private-key", value: "private-value" }],
          },
        }),
      );

      // Act
      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
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
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "old-key", value: "test-value" }],
            privateMetadata: [{ key: "old-private-key", value: "private-test-value" }],
          },
        }),
      );

      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
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
        result.current.handleMetadataChange(metadataEvent);
        result.current.handlePrivateMetadataChange(privateMetadataEvent);
      });

      // Assert
      expect(formMethods.result.current.getValues("metadata.0")).toEqual({
        key: "new-key",
        value: "test-value",
      });
      expect(formMethods.result.current.getValues("privateMetadata.0")).toEqual({
        key: "new-private-key",
        value: "private-test-value",
      });
    });

    it("handles update action for metadata values", () => {
      // Arrange
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test-key", value: "old-value" }],
            privateMetadata: [{ key: "private-test-key", value: "old-private-value" }],
          },
        }),
      );

      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
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
        result.current.handleMetadataChange(metadataEvent);
        result.current.handlePrivateMetadataChange(privateMetadataEvent);
      });

      // Assert
      expect(formMethods.result.current.getValues("metadata.0")).toEqual({
        key: "test-key",
        value: "new-value",
      });
      expect(formMethods.result.current.getValues("privateMetadata.0")).toEqual({
        key: "private-test-key",
        value: "new-private-value",
      });
    });

    it("handles add action for metadata and privateMetadata", () => {
      // Arrange
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [],
            privateMetadata: [],
          },
        }),
      );

      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
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
        result.current.handleMetadataChange(event);
        result.current.handlePrivateMetadataChange(event);
      });

      // Assert
      expect(formMethods.result.current.getValues("metadata")).toEqual([
        {
          key: "",
          value: "",
        },
      ]);
      expect(formMethods.result.current.getValues("privateMetadata")).toEqual([
        {
          key: "",
          value: "",
        },
      ]);
    });

    it("handles delete action for metadata and privateMetadata", () => {
      // Arrange
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test", value: "value" }],
            privateMetadata: [{ key: "private-test", value: "private-value" }],
          },
        }),
      );

      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
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
        result.current.handleMetadataChange(event);
        result.current.handlePrivateMetadataChange(event);
      });

      // Assert
      expect(formMethods.result.current.getValues("metadata")).toEqual([]);
      expect(formMethods.result.current.getValues("privateMetadata")).toEqual([]);
    });

    it("validates and rejects duplicate keys in metadata", async () => {
      // Arrange
      const { result: reactHookForm } = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
        }),
      );

      const { result: metadataFormControls } = renderHook(() =>
        useMetadataFormControls({
          control: reactHookForm.current.control,
          trigger: reactHookForm.current.trigger,
          getValues: reactHookForm.current.getValues,
          formState: reactHookForm.current.formState,
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
        metadataFormControls.current.handleMetadataChange(eventAdd);
        metadataFormControls.current.handlePrivateMetadataChange(eventAdd);

        // Update
        metadataFormControls.current.handleMetadataChange(metadataUpdate);
        metadataFormControls.current.handlePrivateMetadataChange(privateMetadataUpdate);
      });

      // Assert
      expect(reactHookForm.current.formState.errors.metadata).toMatchObject({
        root: {
          type: "validate",
          message: "Metadata keys must be unique, remove duplicate key",
        },
      });
      expect(reactHookForm.current.formState.errors.privateMetadata).toMatchObject({
        root: {
          type: "validate",
          message: "Metadata keys must be unique, remove duplicate key",
        },
      });
    });

    it("validates and rejects empty keys in metadata", async () => {
      // Arrange
      const { result: reactHookForm } = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
          // Required for empty value validation
          mode: "onChange",
        }),
      );

      const { result: metadataFormControls } = renderHook(() =>
        useMetadataFormControls({
          control: reactHookForm.current.control,
          trigger: reactHookForm.current.trigger,
          getValues: reactHookForm.current.getValues,
          formState: reactHookForm.current.formState,
        }),
      );

      const eventAdd: ChangeEvent = {
        target: {
          name: EventDataAction.add,
          value: "",
        },
      };

      // Act
      await act(async () => {
        metadataFormControls.current.handleMetadataChange(eventAdd);
        metadataFormControls.current.handlePrivateMetadataChange(eventAdd);
      });

      // Assert
      expect(reactHookForm.current.formState.errors.metadata).toMatchObject({
        root: {
          type: "validate",
          message: "Metadata key cannot be empty",
        },
      });
      expect(reactHookForm.current.formState.errors.privateMetadata).toMatchObject({
        root: {
          type: "validate",
          message: "Metadata key cannot be empty",
        },
      });
    });

    it("returns empty error arrays when there are no errors", () => {
      // Arrange
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "valid-key", value: "value" }],
            privateMetadata: [{ key: "valid-private-key", value: "private-value" }],
          },
        }),
      );

      // Act
      const { result } = renderHook(() =>
        useMetadataFormControls({
          control: formMethods.result.current.control,
          trigger: formMethods.result.current.trigger,
          getValues: formMethods.result.current.getValues,
          formState: formMethods.result.current.formState,
        }),
      );

      // Assert
      expect(result.current.metadataErrors).toEqual([]);
      expect(result.current.privateMetadataErrors).toEqual([]);
    });
  });
});
