import { OutputData } from "@editorjs/editorjs";
import { EditorCore } from "@react-editor-js/core";
import { MutableRefObject, useMemo, useRef, useState } from "react";

export interface UseRichTextOptions {
  initial: string | null | undefined;
  loading?: boolean;
  triggerChange: () => void;
}

interface UseRichTextResult {
  editorRef: MutableRefObject<EditorCore | null>;
  handleChange: () => void;
  getValue: () => Promise<OutputData>;
  defaultValue: OutputData | undefined;
  isReadyForMount: boolean;
}

export function useRichText({
  initial,
  loading,
  triggerChange,
}: UseRichTextOptions): UseRichTextResult {
  const editorRef = useRef<EditorCore | null>(null);
  const [isReadyForMount, setIsReadyForMount] = useState(false);

  const handleChange = () => {
    triggerChange();
  };

  const getValue = async () => {
    if (editorRef.current) {
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
      return "";
    }

    try {
      const result = JSON.parse(initial);
      setIsReadyForMount(true);
      return result;
    } catch (e) {
      return undefined;
    }
  }, [initial, loading]);

  return {
    editorRef,
    handleChange,
    getValue,
    defaultValue,
    isReadyForMount,
  };
}

export default useRichText;
