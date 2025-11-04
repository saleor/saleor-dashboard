import { OutputData } from "@editorjs/editorjs";
import { EditorCore } from "@react-editor-js/core";
import { MutableRefObject, useMemo, useRef, useState } from "react";

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
  const handleChange = () => {
    setIsDirty(true);
    triggerChange();
  };
  const getValue = async () => {
    if (editorRef.current) {
      setIsDirty(false);

      return editorRef.current.save();
    } else {
      throw new Error("Editor instance is not available");
    }
  };

  const defaultValue = useMemo<OutputData | undefined>(() => {
    if (loading) {
      return;
    }

    if (!initial) {
      setIsReadyForMount(true);
      setIsDirty(false);

      return "";
    }

    try {
      const result = JSON.parse(initial);

      setIsDirty(false);
      setIsReadyForMount(true);

      return result;
    } catch (e) {
      return undefined;
    }
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
