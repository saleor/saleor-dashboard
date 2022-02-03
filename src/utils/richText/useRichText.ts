import { OutputData } from "@editorjs/editorjs";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import isEqual from "lodash/isEqual";
import { MutableRefObject, useEffect, useRef, useState } from "react";

function useRichText(opts: {
  initial: string | null;
  triggerChange: () => void;
}): [MutableRefObject<OutputData>, RichTextEditorChange] {
  const data = useRef<OutputData>();
  const [, setLoaded] = useState(false);

  useEffect(() => {
    if (opts.initial === null) {
      data.current = { blocks: [] };
      setLoaded(true);
      return;
    }

    try {
      data.current = JSON.parse(opts.initial);
      setLoaded(true);
    } catch {
      data.current = undefined;
    }
  }, [opts.initial]);

  const change: RichTextEditorChange = newData => {
    if (isEqual(data.current.blocks, newData.blocks)) {
      return;
    }

    opts.triggerChange();
    data.current = newData;
  };

  return [data, change];
}

export default useRichText;
