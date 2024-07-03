import { useRichText, UseRichTextOptions } from "../useRichText";

const useRichTextMocked = ({
  initial,
  triggerChange,
}: UseRichTextOptions): ReturnType<typeof useRichText> => ({
  editorRef: { current: null },
  defaultValue: initial ? JSON.parse(initial) : undefined,
  getValue: async () => ({ blocks: [] }),
  handleChange: triggerChange,
  isReadyForMount: true,
  isDirty: false,
});

export default useRichTextMocked;
