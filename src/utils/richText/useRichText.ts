import { OutputData } from "@editorjs/editorjs";
import { EditorCore } from "@saleor/components/RichTextEditor";
import { useMemo, useRef, useState } from "react";

interface UseRichTextOptions {
  initial: string | null;
  triggerChange: () => void;
}

export function useRichText({ initial, triggerChange }: UseRichTextOptions) {
  const editorRef = useRef<EditorCore>(null);
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
    try {
      const result = JSON.parse(initial);
      setIsReadyForMount(true);
      return result;
    } catch (e) {
      return undefined;
    }
  }, [initial]);

  return {
    editorRef,
    handleChange,
    getValue,
    defaultValue,
    isReadyForMount
  };
}

export default useRichText;
