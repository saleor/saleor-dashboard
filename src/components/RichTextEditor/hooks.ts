import { type EditorConfig } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { type MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

export const useHasRendered = () => {
  const [hasRendered, setHasRendereed] = useState(false);

  useLayoutEffect(() => {
    setHasRendereed(true);
  }, []);

  return hasRendered;
};

export const useUpdateOnRerender = ({
  renderRef,
  defaultValue,
  hasRendered,
  isEditorReady,
}: {
  renderRef: MutableRefObject<EditorCore["render"] | undefined>;
  defaultValue: EditorConfig["data"];
  hasRendered: boolean;
  isEditorReady: boolean;
}) => {
  const prevDefaultValue = useRef<EditorConfig["data"] | undefined>(undefined);
  const hasSyncedInitialValue = useRef(false);

  useEffect(() => {
    if (!hasRendered || !isEditorReady) {
      return;
    }

    if (defaultValue === undefined) {
      return;
    }

    if (JSON.stringify(defaultValue) === JSON.stringify(prevDefaultValue.current)) {
      return;
    }

    const isInitialSync = !hasSyncedInitialValue.current;

    prevDefaultValue.current = defaultValue;
    hasSyncedInitialValue.current = true;

    // Editor.js is created with `data` from props; calling render() on first mount duplicates blocks.
    if (isInitialSync) {
      return;
    }

    renderRef.current?.({
      blocks: defaultValue?.blocks ?? [],
    });
  }, [defaultValue, hasRendered, isEditorReady, renderRef]);
};
