import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { type MutableRefObject, useEffect, useRef, useState } from "react";

import { parseEditorData } from "./parseEditorData";

export interface UseRichTextOptions {
  initial: string | null | undefined;
  loading?: boolean;
  triggerChange: () => void;
}

export interface UseRichTextResult {
  editorRef: MutableRefObject<EditorCore | null>;
  handleChange: () => void;
  getValue: () => Promise<OutputData>;
  defaultValue: OutputData | undefined;
  isReadyForMount: boolean;
  isDirty: boolean;
}

export function useRichText({
  initial,
  loading,
  triggerChange,
}: UseRichTextOptions): UseRichTextResult {
  const editorRef = useRef<EditorCore | null>(null);
  const [isReadyForMount, setIsReadyForMount] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [defaultValue, setDefaultValue] = useState<OutputData | undefined>(undefined);

  const handleChange = () => {
    setIsDirty(true);
    triggerChange();
  };

  const getValue = async () => {
    if (editorRef.current) {
      setIsDirty(false);

      return editorRef.current.save();
    }

    throw new Error("Editor instance is not available");
  };

  useEffect(() => {
    if (loading) {
      setIsReadyForMount(false);
      setDefaultValue(undefined);
      setIsDirty(false);

      return;
    }

    setDefaultValue(parseEditorData(initial));
    setIsReadyForMount(true);
    setIsDirty(false);
  }, [initial, loading]);

  return {
    isDirty,
    editorRef,
    handleChange,
    getValue,
    defaultValue,
    isReadyForMount,
  };
}

export default useRichText;
