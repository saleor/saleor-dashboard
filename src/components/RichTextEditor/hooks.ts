import { EditorConfig } from "@editorjs/editorjs";
import { EditorCore } from "@react-editor-js/core";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const useHasRendered = () => {
  const [hasRendered, setHasRendereed] = useState(false);

  useLayoutEffect(() => {
    setHasRendereed(true);
  }, []);

  return hasRendered;
};

export const useUpdateOnRerender = ({
  render,
  defaultValue,
  hasRendered,
}: {
  render: EditorCore["render"] | undefined;
  defaultValue: EditorConfig["data"];
  hasRendered: boolean;
}) => {
  const prevDefaultValue = useRef<EditorConfig["data"] | undefined>(undefined);

  useEffect(() => {
    if (!hasRendered) {
      return;
    }

    // Prevent call render when defaultValue doesn't change
    if (JSON.stringify(defaultValue) === JSON.stringify(prevDefaultValue.current)) {
      return;
    }

    prevDefaultValue.current = defaultValue;

    render?.({
      blocks: defaultValue?.blocks ?? [],
    });
  }, [defaultValue, hasRendered, render]);
};
