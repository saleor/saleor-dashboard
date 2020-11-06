import { OutputData } from "@editorjs/editorjs";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { MutableRefObject, useEffect, useRef, useState } from "react";

function useRichText(opts: {
  initial: string | null;
  triggerChange: () => void;
}): [MutableRefObject<OutputData>, RichTextEditorChange] {
  const data = useRef<OutputData>(
    opts.initial === null ? { blocks: [] } : undefined
  );
  const [, setLoaded] = useState(false);
  useEffect(() => {
    if (opts.initial !== null) {
      try {
        data.current = JSON.parse(opts.initial);
        setLoaded(true);
      } catch {
        data.current = undefined;
      }
    }
  }, [opts.initial]);

  const change: RichTextEditorChange = newData => {
    opts.triggerChange();
    data.current = newData;
  };

  return [data, change];
}

export default useRichText;
