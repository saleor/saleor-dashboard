import { useRichText } from "../useRichText";

const useRichTextMocked = ({
  initial,
  triggerChange,
}): ReturnType<typeof useRichText> => ({
  editorRef: { current: null },
  defaultValue: initial ? JSON.parse(initial) : undefined,
  getValue: async () => ({ blocks: [] }),
  handleChange: triggerChange,
  isReadyForMount: true,
});

export default useRichTextMocked;
