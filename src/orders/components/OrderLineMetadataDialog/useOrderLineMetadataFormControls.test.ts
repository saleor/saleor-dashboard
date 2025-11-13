import { ChangeEvent } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { EventDataAction, EventDataField } from "../../../components/Metadata/types";
import { OrderLineAndVariantMetadataFormData } from "./OrderLineMetadataDialog";
import { useOrderLineMetadataFormControls } from "./useOrderLineMetadataFormControls";

describe("useOrderLineMetadataFormControls", () => {
  it("returns form values from hook form for both orderLine and variant", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "order-key", value: "order-value" }],
            privateMetadata: [{ key: "order-private-key", value: "order-private-value" }],
          },
          variant: {
            metadata: [{ key: "variant-key", value: "variant-value" }],
            privateMetadata: [{ key: "variant-private-key", value: "variant-private-value" }],
          },
        },
      }),
    );

    // Act
    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    // Assert
    expect(result.current.orderLineMetadataFields).toEqual([
      {
        key: "order-key",
        value: "order-value",
        id: expect.any(String),
      },
    ]);
    expect(result.current.orderLinePrivateMetadataFields).toEqual([
      {
        key: "order-private-key",
        value: "order-private-value",
        id: expect.any(String),
      },
    ]);
    expect(result.current.variantMetadataFields).toEqual([
      {
        key: "variant-key",
        value: "variant-value",
        id: expect.any(String),
      },
    ]);
    expect(result.current.variantPrivateMetadataFields).toEqual([
      {
        key: "variant-private-key",
        value: "variant-private-value",
        id: expect.any(String),
      },
    ]);
  });

  it("handles update action for orderLine metadata keys", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "old-key", value: "test-value" }],
            privateMetadata: [{ key: "old-private-key", value: "private-test-value" }],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `orderLine.metadata:0:${EventDataField.name}`,
        value: "new-key",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `orderLine.privateMetadata:0:${EventDataField.name}`,
        value: "new-private-key",
      },
    };

    // Act
    act(() => {
      result.current.handleOrderLineMetadataChange(metadataEvent);
      result.current.handleOrderLinePrivateMetadataChange(privateMetadataEvent);
    });

    // Assert
    expect(formMethods.result.current.getValues("orderLine.metadata.0")).toEqual({
      key: "new-key",
      value: "test-value",
    });
    expect(formMethods.result.current.getValues("orderLine.privateMetadata.0")).toEqual({
      key: "new-private-key",
      value: "private-test-value",
    });
  });

  it("handles update action for orderLine metadata values", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "test-key", value: "old-value" }],
            privateMetadata: [{ key: "private-test-key", value: "old-private-value" }],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `orderLine.metadata:0:${EventDataField.value}`,
        value: "new-value",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `orderLine.privateMetadata:0:${EventDataField.value}`,
        value: "new-private-value",
      },
    };

    // Act
    act(() => {
      result.current.handleOrderLineMetadataChange(metadataEvent);
      result.current.handleOrderLinePrivateMetadataChange(privateMetadataEvent);
    });

    // Assert
    expect(formMethods.result.current.getValues("orderLine.metadata.0")).toEqual({
      key: "test-key",
      value: "new-value",
    });
    expect(formMethods.result.current.getValues("orderLine.privateMetadata.0")).toEqual({
      key: "private-test-key",
      value: "new-private-value",
    });
  });

  it("handles update action for variant metadata keys", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [{ key: "old-key", value: "test-value" }],
            privateMetadata: [{ key: "old-private-key", value: "private-test-value" }],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `variant.metadata:0:${EventDataField.name}`,
        value: "new-key",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `variant.privateMetadata:0:${EventDataField.name}`,
        value: "new-private-key",
      },
    };

    // Act
    act(() => {
      result.current.handleVariantMetadataChange(metadataEvent);
      result.current.handleVariantPrivateMetadataChange(privateMetadataEvent);
    });

    // Assert
    expect(formMethods.result.current.getValues("variant.metadata.0")).toEqual({
      key: "new-key",
      value: "test-value",
    });
    expect(formMethods.result.current.getValues("variant.privateMetadata.0")).toEqual({
      key: "new-private-key",
      value: "private-test-value",
    });
  });

  it("handles update action for variant metadata values", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [{ key: "test-key", value: "old-value" }],
            privateMetadata: [{ key: "private-test-key", value: "old-private-value" }],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    const metadataEvent: ChangeEvent = {
      target: {
        name: `variant.metadata:0:${EventDataField.value}`,
        value: "new-value",
      },
    };

    const privateMetadataEvent: ChangeEvent = {
      target: {
        name: `variant.privateMetadata:0:${EventDataField.value}`,
        value: "new-private-value",
      },
    };

    // Act
    act(() => {
      result.current.handleVariantMetadataChange(metadataEvent);
      result.current.handleVariantPrivateMetadataChange(privateMetadataEvent);
    });

    // Assert
    expect(formMethods.result.current.getValues("variant.metadata.0")).toEqual({
      key: "test-key",
      value: "new-value",
    });
    expect(formMethods.result.current.getValues("variant.privateMetadata.0")).toEqual({
      key: "private-test-key",
      value: "new-private-value",
    });
  });

  it("handles add action for orderLine metadata and privateMetadata", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      result.current.handleOrderLineMetadataChange(event);
      result.current.handleOrderLinePrivateMetadataChange(event);
    });

    // Assert
    expect(formMethods.result.current.getValues("orderLine.metadata")).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
    expect(formMethods.result.current.getValues("orderLine.privateMetadata")).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
  });

  it("handles add action for variant metadata and privateMetadata", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      result.current.handleVariantMetadataChange(event);
      result.current.handleVariantPrivateMetadataChange(event);
    });

    // Assert
    expect(formMethods.result.current.getValues("variant.metadata")).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
    expect(formMethods.result.current.getValues("variant.privateMetadata")).toEqual([
      {
        key: "",
        value: "",
      },
    ]);
  });

  it("handles delete action for orderLine metadata and privateMetadata", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "test", value: "value" }],
            privateMetadata: [{ key: "private-test", value: "private-value" }],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      result.current.handleOrderLineMetadataChange(event);
      result.current.handleOrderLinePrivateMetadataChange(event);
    });

    // Assert
    expect(formMethods.result.current.getValues("orderLine.metadata")).toEqual([]);
    expect(formMethods.result.current.getValues("orderLine.privateMetadata")).toEqual([]);
  });

  it("handles delete action for variant metadata and privateMetadata", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [{ key: "test", value: "value" }],
            privateMetadata: [{ key: "private-test", value: "private-value" }],
          },
        },
      }),
    );

    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      result.current.handleVariantMetadataChange(event);
      result.current.handleVariantPrivateMetadataChange(event);
    });

    // Assert
    expect(formMethods.result.current.getValues("variant.metadata")).toEqual([]);
    expect(formMethods.result.current.getValues("variant.privateMetadata")).toEqual([]);
  });

  it("validates and rejects duplicate keys in orderLine metadata", async () => {
    // Arrange
    const { result: reactHookForm } = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
      }),
    );

    const { result: metadataFormControls } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
        name: `orderLine.metadata:1:${EventDataField.name}`,
        value: "test",
      },
    };

    const privateMetadataUpdate: ChangeEvent = {
      target: {
        name: `orderLine.privateMetadata:1:${EventDataField.name}`,
        value: "private-test",
      },
    };

    // Act
    await act(async () => {
      // Add
      metadataFormControls.current.handleOrderLineMetadataChange(eventAdd);
      metadataFormControls.current.handleOrderLinePrivateMetadataChange(eventAdd);

      // Update
      metadataFormControls.current.handleOrderLineMetadataChange(metadataUpdate);
      metadataFormControls.current.handleOrderLinePrivateMetadataChange(privateMetadataUpdate);
    });

    // Assert
    expect(reactHookForm.current.formState.errors.orderLine?.metadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata keys must be unique, remove duplicate key",
      },
    });
    expect(reactHookForm.current.formState.errors.orderLine?.privateMetadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata keys must be unique, remove duplicate key",
      },
    });
  });

  it("validates and rejects duplicate keys in variant metadata", async () => {
    // Arrange
    const { result: reactHookForm } = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
        },
      }),
    );

    const { result: metadataFormControls } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
        name: `variant.metadata:1:${EventDataField.name}`,
        value: "test",
      },
    };

    const privateMetadataUpdate: ChangeEvent = {
      target: {
        name: `variant.privateMetadata:1:${EventDataField.name}`,
        value: "private-test",
      },
    };

    // Act
    await act(async () => {
      // Add
      metadataFormControls.current.handleVariantMetadataChange(eventAdd);
      metadataFormControls.current.handleVariantPrivateMetadataChange(eventAdd);

      // Update
      metadataFormControls.current.handleVariantMetadataChange(metadataUpdate);
      metadataFormControls.current.handleVariantPrivateMetadataChange(privateMetadataUpdate);
    });

    // Assert
    expect(reactHookForm.current.formState.errors.variant?.metadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata keys must be unique, remove duplicate key",
      },
    });
    expect(reactHookForm.current.formState.errors.variant?.privateMetadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata keys must be unique, remove duplicate key",
      },
    });
  });

  it("validates and rejects empty keys in orderLine metadata", async () => {
    // Arrange
    const { result: reactHookForm } = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
          variant: {
            metadata: [],
            privateMetadata: [],
          },
        },
        // Required for empty value validation
        mode: "onChange",
      }),
    );

    const { result: metadataFormControls } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      metadataFormControls.current.handleOrderLineMetadataChange(eventAdd);
      metadataFormControls.current.handleOrderLinePrivateMetadataChange(eventAdd);
    });

    // Assert
    expect(reactHookForm.current.formState.errors.orderLine?.metadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata key cannot be empty",
      },
    });
    expect(reactHookForm.current.formState.errors.orderLine?.privateMetadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata key cannot be empty",
      },
    });
  });

  it("validates and rejects empty keys in variant metadata", async () => {
    // Arrange
    const { result: reactHookForm } = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [],
            privateMetadata: [],
          },
          variant: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [{ key: "private-test", value: "private-value1" }],
          },
        },
        // Required for empty value validation
        mode: "onChange",
      }),
    );

    const { result: metadataFormControls } = renderHook(() =>
      useOrderLineMetadataFormControls({
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
      metadataFormControls.current.handleVariantMetadataChange(eventAdd);
      metadataFormControls.current.handleVariantPrivateMetadataChange(eventAdd);
    });

    // Assert
    expect(reactHookForm.current.formState.errors.variant?.metadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata key cannot be empty",
      },
    });
    expect(reactHookForm.current.formState.errors.variant?.privateMetadata).toMatchObject({
      root: {
        type: "validate",
        message: "Metadata key cannot be empty",
      },
    });
  });

  it("returns empty error arrays when there are no errors", () => {
    // Arrange
    const formMethods = renderHook(() =>
      useForm<OrderLineAndVariantMetadataFormData>({
        values: {
          orderLine: {
            metadata: [{ key: "valid-key", value: "value" }],
            privateMetadata: [{ key: "valid-private-key", value: "private-value" }],
          },
          variant: {
            metadata: [{ key: "variant-key", value: "variant-value" }],
            privateMetadata: [{ key: "variant-private-key", value: "variant-private-value" }],
          },
        },
      }),
    );

    // Act
    const { result } = renderHook(() =>
      useOrderLineMetadataFormControls({
        control: formMethods.result.current.control,
        trigger: formMethods.result.current.trigger,
        getValues: formMethods.result.current.getValues,
        formState: formMethods.result.current.formState,
      }),
    );

    // Assert
    expect(result.current.orderLineMetadataErrors).toEqual([]);
    expect(result.current.orderLinePrivateMetadataErrors).toEqual([]);
    expect(result.current.variantMetadataErrors).toEqual([]);
    expect(result.current.variantPrivateMetadataErrors).toEqual([]);
  });
});
