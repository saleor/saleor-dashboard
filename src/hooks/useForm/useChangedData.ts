import { useState } from "react";

import { FormData } from "./types";

export const useChangedData = <T extends FormData>(formData: T) => {
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
    .reduce((p, [key, value]) => ({ ...p, [key]: value }), {} as T);

  return {
    add,
    clean,
    data,
  };
};
