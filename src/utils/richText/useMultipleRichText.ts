import { OutputData } from "@editorjs/editorjs";
import { EditorCore } from "@saleor/components/RichTextEditor";
import { useCallback, useRef } from "react";

import useMap from "../objects/useMap";

export type RefsMap<TKey extends string> = Record<TKey, EditorCore | null>;

export interface RichTextGetters<TKey extends string> {
  getShouldMount: (id: TKey) => boolean;
  getDefaultValue: (id: TKey) => OutputData;
  getHandleChange: (id: TKey) => () => void;
  getMountEditor: (id: TKey) => (editor: EditorCore) => void;
}

export type GetRichTextValues = Record<string, OutputData>;

export interface RichTextMultipleOptions<TKey extends string> {
  initial: Record<TKey, string>;
  triggerChange: () => void;
}

export const useMultipleRichText = <TKey extends string>({
  initial,
  triggerChange,
}: RichTextMultipleOptions<TKey>) => {
  const editorRefs = useRef<RefsMap<TKey>>({} as RefsMap<TKey>);
  const [shouldMountMap, { set: setShouldMountById }] = useMap();

  const getMountEditor = useCallback(
    (id: TKey) => (ref: EditorCore | null) => {
      editorRefs.current = {
        ...editorRefs.current,
        [id]: ref,
      };
    },
    [],
  );

  const getHandleChange = (_: TKey) => () => triggerChange();

  const getDefaultValue = useCallback(
    (id: TKey) => {
      if (initial[id] === undefined) {
        setShouldMountById(id, true);
        return "";
      }

      try {
        const result = JSON.parse(initial[id]);
        setShouldMountById(id, true);
        return result;
      } catch (e) {
        return undefined;
      }
    },
    [initial],
  );

  const getShouldMount = useCallback(
    (id: TKey) => shouldMountMap.get(id) ?? false,
    [shouldMountMap],
  );

  const getValues = async () => {
    const availableRefs = Object.entries(editorRefs.current).filter(
      ([, value]) => value !== null,
    ) as Array<[string, EditorCore]>;

    const results = await Promise.all(
      availableRefs.map(async ([key, ref]) => {
        const value = await ref.save();
        return [key, value] as [string, OutputData];
      }),
    );

    return Object.fromEntries(results) as Record<string, OutputData>;
  };

  return {
    getters: {
      getShouldMount,
      getDefaultValue,
      getHandleChange,
      getMountEditor,
    } as RichTextGetters<TKey>,
    getValues,
  };
};
