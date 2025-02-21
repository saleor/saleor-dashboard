import { ChangeEvent } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { EventDataAction, EventDataField, MetadataFormData } from "../Metadata/types";
import { useMetadataFormControls } from "./useMetadataFormControls";

describe("useMetadataFormControls", () => {
  it("returns form values from hook form to be used in form", () => {
    const formMethods = renderHook(() =>
      useForm<MetadataFormData>({
        values: {
          metadata: [{ key: "key", value: "value" }],
          privateMetadata: [{ key: "private-key", value: "private-value" }],
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

    expect(result.current.metadataFields).toEqual([
      {
        key: "key",
        value: "value",
        // hook-form adds id for lists
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

  describe("metadata change handler", () => {
    it("handles update action for metadata key", () => {
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "old-key", value: "test-value" }],
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
          name: `metadata:0:${EventDataField.name}`,
          value: "new-key",
        },
      };

      act(() => {
        result.current.handleMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("metadata.0")).toEqual({
        key: "new-key",
        value: "test-value",
      });
    });

    it("handles update action for metadata value", () => {
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test-key", value: "old-value" }],
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
          name: `metadata:0:${EventDataField.value}`,
          value: "new-value",
        },
      };

      act(() => {
        result.current.handleMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("metadata.0")).toEqual({
        key: "test-key",
        value: "new-value",
      });
    });

    it("handles add action for metadata", () => {
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

      act(() => {
        result.current.handleMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("metadata")).toEqual([
        {
          key: "",
          value: "",
        },
      ]);
    });

    it("handles delete action for metadata", () => {
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test", value: "value" }],
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
          name: EventDataAction.delete,
          value: 0,
        },
      };

      act(() => {
        result.current.handleMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("metadata")).toEqual([]);
    });
  });

  describe("private metadata change handler", () => {
    it("handles update action for private metadata key", () => {
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [],
            privateMetadata: [{ key: "old-key", value: "test-value" }],
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
          name: `privateMetadata:0:${EventDataField.name}`,
          value: "new-key",
        },
      };

      act(() => {
        result.current.handlePrivateMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("privateMetadata.0")).toEqual({
        key: "new-key",
        value: "test-value",
      });
    });

    it("handles add action for private metadata", () => {
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

      act(() => {
        result.current.handlePrivateMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("privateMetadata")).toEqual([
        {
          key: "",
          value: "",
        },
      ]);
    });

    it("handles delete action for private metadata", () => {
      const formMethods = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [],
            privateMetadata: [{ key: "test", value: "value" }],
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

      act(() => {
        result.current.handlePrivateMetadataChange(event);
      });

      expect(formMethods.result.current.getValues("privateMetadata")).toEqual([]);
    });
  });

  describe("metadata validation", () => {
    it("validates and rejects duplicate keys in metadata", async () => {
      const { result: reactHookForm } = renderHook(() =>
        useForm<MetadataFormData>({
          values: {
            metadata: [{ key: "test", value: "value1" }],
            privateMetadata: [],
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
          value: "new-value",
        },
      };
      const eventUpdate: ChangeEvent = {
        target: {
          name: `metadata:1:${EventDataField.name}`,
          value: "test",
        },
      };

      await act(async () => {
        metadataFormControls.current.handleMetadataChange(eventAdd);
        metadataFormControls.current.handleMetadataChange(eventUpdate);
      });

      expect(reactHookForm.current.formState.errors.metadata).toMatchObject({
        root: {
          type: "validate",
          message: "Metadata keys must be unique, remove duplicate key",
        },
      });
    });
  });
});
