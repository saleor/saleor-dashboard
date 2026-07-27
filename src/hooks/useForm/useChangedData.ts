import isEqual from "lodash/isEqual";
import { useState } from "react";

import { type FormData } from "./types";

/**
 * Tracks which fields the user has edited and exposes only those whose
 * current value still differs from the form's initial data.
 *
 * Touching a field and reverting it to the original value must not keep it
 * in `data` — otherwise Save payloads and dirty UI stay falsely dirty.
 *
 * @deprecated use react-hook-form instead
 */
export const useChangedData = <T extends FormData>(formData: T, initialData: T) => {
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  const add = (name: string) => {
    setDirtyFields(fields => {
      return Array.from(new Set(fields.concat(name)));
    });
  };

  const clean = () => {
    setDirtyFields([]);
  };

  const data = Object.entries(formData)
    .filter(([key]) => dirtyFields.includes(key))
    .filter(([key, value]) => !isEqual(value, initialData[key as keyof T]))
    .reduce((p, [key, value]) => ({ ...p, [key]: value }), {} as T);

  return {
    add,
    clean,
    data,
  };
};
