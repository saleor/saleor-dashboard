import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { EventDataAction, EventDataField } from "@dashboard/components/Metadata/types";
import { getDataKey, parseEventData } from "@dashboard/components/Metadata/utils";
import { type MetadataInput, type MetadataItemFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { flattenErrors } from "@dashboard/utils/hook-form/errors";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useLayoutEffect, useMemo, useState } from "react";
import { type FieldError, useFieldArray, useForm, type UseFormReset } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidateMetadata } from "./validation";

interface UseMetadataFormConfig {
  graphqlData:
    | {
        /** Lets the form tell another object apart from new data for the same one. */
        id?: string;
        metadata: MetadataItemFragment[];
        privateMetadata: MetadataItemFragment[];
      }
    | undefined;
  submitInProgress: boolean;
}

type MetadataFieldArray = Array<{ id: string; key: string; value: string }>;

interface MetadataFormReturn {
  metadataFields: MetadataFieldArray;
  privateMetadataFields: MetadataFieldArray;
  metadataErrors: string[];
  privateMetadataErrors: string[];
  reset: UseFormReset<MetadataFormData>;
  formIsDirty: boolean;
  handleChange: (event: ChangeEvent, isPrivate: boolean) => void;
  formData: MetadataFormData;
  getFormData: () => MetadataFormData;
  /** What the form was loaded with. Saves are compared with it, so they send only the user's changes. */
  baseline: MetadataFormData | undefined;
}

const nothingLoaded: MetadataFormData = { metadata: [], privateMetadata: [] };

const toFormData = (
  graphqlData: UseMetadataFormConfig["graphqlData"],
): MetadataFormData | undefined =>
  graphqlData
    ? {
        metadata: (graphqlData.metadata ?? []).map(mapMetadataItemToInput),
        privateMetadata: (graphqlData.privateMetadata ?? []).map(mapMetadataItemToInput),
      }
    : undefined;

const sortedEntries = (entries: MetadataInput[]): string[] =>
  entries.map(({ key, value }) => JSON.stringify([key, value])).sort();

// The order of the rows isn't saved, so it doesn't matter here.
const areEntriesEqual = (a: MetadataInput[], b: MetadataInput[]): boolean => {
  const sortedA = sortedEntries(a);
  const sortedB = sortedEntries(b);

  return sortedA.length === sortedB.length && sortedA.every((entry, i) => entry === sortedB[i]);
};

export const areMetadataFormDataEqual = (a: MetadataFormData, b: MetadataFormData): boolean =>
  areEntriesEqual(a.metadata, b.metadata) && areEntriesEqual(a.privateMetadata, b.privateMetadata);

// A row with neither key nor value isn't saved. A row with only a value is something the user
// typed (validation then asks for its key), so it stays.
const withoutBlankRows = (entries: MetadataInput[]): MetadataInput[] =>
  entries.filter(({ key, value }) => key !== "" || value !== "");

/**
 * Whether the form differs from what it was loaded with in anything but blank rows and row order.
 * Removing an entry and adding it back is no change.
 */
export const hasMetadataChanges = (
  current: MetadataFormData,
  baseline: MetadataFormData,
): boolean =>
  !areMetadataFormDataEqual(
    {
      metadata: withoutBlankRows(current.metadata),
      privateMetadata: withoutBlankRows(current.privateMetadata),
    },
    baseline,
  );

export const useMetadataForm = ({
  graphqlData,
  submitInProgress,
}: UseMetadataFormConfig): MetadataFormReturn => {
  const intl = useIntl();
  const loaded = useMemo(() => toFormData(graphqlData), [graphqlData]);
  const loadedId = graphqlData?.id;
  // What the form was loaded with, and for which object.
  const [loadedState, setLoadedState] = useState<{
    id: string | undefined;
    data: MetadataFormData | undefined;
  }>({ id: loadedId, data: loaded });
  const baseline = loadedState.data;

  const formMethods = useForm<MetadataFormData>({
    defaultValues: loaded ?? nothingLoaded,
  });

  const { control, getValues, formState, trigger, reset } = formMethods;
  const { isDirty } = formState;

  // Newly loaded metadata goes into the form only while the user has no unsaved edits, so a
  // reload never replaces or moves what they're typing, and a failed save keeps their edits.
  // Saves are compared with `baseline`, so an entry the user didn't touch is never sent, even
  // when the server has a newer value for it than the form shows. The first load always goes
  // in: nothing can be saved before it, so anything typed earlier has no baseline to save against.
  // When the data belongs to another object, edits made to the previous one don't carry over.
  const otherObject = !!loaded && loadedId !== loadedState.id;
  const loadIntoForm =
    !!loaded &&
    !submitInProgress &&
    (otherObject ||
      ((!baseline || !isDirty) && !(baseline && areMetadataFormDataEqual(baseline, loaded))));

  if (loadIntoForm) {
    setLoadedState({ id: loadedId, data: loaded });
  }

  useLayoutEffect(
    function showBaselineInForm() {
      if (baseline) {
        reset(baseline);
      }
    },
    [baseline, reset],
  );

  const metadataControls = useFieldArray({
    control,
    name: "metadata",
    rules: {
      validate: value => getValidateMetadata(intl)(value),
    },
  });

  const privateMetadataControls = useFieldArray({
    control,
    name: "privateMetadata",
    rules: {
      validate: value => getValidateMetadata(intl)(value),
    },
  });

  const controlsMap = {
    metadata: metadataControls,
    privateMetadata: privateMetadataControls,
  };

  const getHandleChange = (type: "metadata" | "privateMetadata") => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls = controlsMap[metadataType];

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        const existingValue = getValues(`${metadataType}.${fieldIndex}`);

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...(existingValue as MetadataInput),
          [fieldObjKey]: value,
        });

        // Trigger re-validation of data at the parent path
        trigger(metadataType);
      }

      // Adding or removing a row clears the field array's error, so check the rows again.
      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" });
        trigger(metadataType);
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
        trigger(metadataType);
      }
    };
  };

  const handleMetadataChange = getHandleChange("metadata");
  const handlePrivateMetadataChange = getHandleChange("privateMetadata");

  const metadataErrors = useMemo(
    () => flattenErrors(formState.errors.metadata as FieldError),
    [formState.errors.metadata],
  );

  const privateMetadataErrors = useMemo(
    () => flattenErrors(formState.errors.privateMetadata as FieldError),
    [formState.errors.privateMetadata],
  );

  const handleChange = (event: ChangeEvent, isPrivate: boolean) => {
    if (isPrivate) {
      handlePrivateMetadataChange(event);
    } else {
      handleMetadataChange(event);
    }
  };

  return {
    metadataFields: metadataControls.fields,
    privateMetadataFields: privateMetadataControls.fields,
    metadataErrors,
    privateMetadataErrors,
    reset,
    // Nothing to save against until metadata is loaded.
    formIsDirty: !!baseline && isDirty && hasMetadataChanges(getValues(), baseline),
    handleChange,
    formData: getValues(),
    getFormData: () => getValues(),
    baseline,
  };
};
