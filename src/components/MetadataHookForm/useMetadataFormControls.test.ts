import { ChangeEvent } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { EventDataAction, EventDataField, MetadataFormData } from "../Metadata/types";
import { useMetadataFormControls } from "./useMetadataFormControls";

describe("useMetadataFormControls", () => {
  it("returns form values from hook form to be used in form", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<MetadataFormData>({
        values: {
          metadata: [{ key: "key", value: "value" }],
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
      }),
    );

    // Assert
    expect(result.current.metadataFields).toEqual([
      {
        key: "key",
        value: "value",
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

  it("handles update action for metadata and privateMetadata keys", () => {
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

  it("handles update action for metadata and privateMetadata values", () => {
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

  it("validates and rejects duplicate keys in both metadata and privateMetadata", async () => {
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

  it("validates and rejects empty keys in both metadata and privateMetadata", async () => {
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
});
