import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { useCallback, useRef } from "react";

import { parseEditorData } from "./parseEditorData";

type RefsMap<TKey extends string> = Record<TKey, EditorCore | null>;

export interface RichTextGetters<TKey extends string> {
  getShouldMount: (id: TKey) => boolean;
  getDefaultValue: (id: TKey) => OutputData;
  getHandleChange: (id: TKey) => () => void;
  getMountEditor: (id: TKey) => (editor: EditorCore) => void;
}

export type GetRichTextValues = Record<string, OutputData>;

interface RichTextMultipleOptions<TKey extends string> {
  initial: Record<TKey, string>;
  triggerChange: () => void;
}

export const useMultipleRichText = <TKey extends string>({
  initial,
  triggerChange,
}: RichTextMultipleOptions<TKey>) => {
  const editorRefs = useRef<RefsMap<TKey>>({} as RefsMap<TKey>);
  const triggerChangeRef = useRef(triggerChange);
  const changeHandlersRef = useRef({} as Record<TKey, () => void>);
  const parsedCacheRef = useRef(new Map<string, OutputData>());

  triggerChangeRef.current = triggerChange;

  const getMountEditor = useCallback(
    (id: TKey) => (ref: EditorCore | null) => {
      editorRefs.current = {
        ...editorRefs.current,
        [id]: ref,
      };
    },
    [],
  );
  const getHandleChange = useCallback((id: TKey) => {
    const existing = changeHandlersRef.current[id];

    if (existing) {
      return existing;
    }

    const handler = () => {
      triggerChangeRef.current();
    };

    changeHandlersRef.current[id] = handler;

    return handler;
  }, []);
  const getDefaultValue = useCallback(
    (id: TKey) => {
      const raw = initial[id];
      const cacheKey = raw === undefined ? `${id}::empty` : `${id}::${raw}`;
      const cached = parsedCacheRef.current.get(cacheKey);

      if (cached) {
        return cached;
      }

      const parsed = parseEditorData(raw);

      parsedCacheRef.current.set(cacheKey, parsed);

      return parsed;
    },
    [initial],
  );
  // Always ready: empty or invalid JSON mounts an empty editor, same as useRichText after load.
  const getShouldMount = useCallback((_id: TKey) => true, []);
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
