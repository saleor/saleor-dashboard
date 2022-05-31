import React from "react";

import RichTextEditor, { RichTextEditorProps } from "./RichTextEditor";

interface RichTextEditorLoadingProps
  extends Omit<
    RichTextEditorProps,
    | "disabled"
    | "editorRef"
    | "onChange"
    | "defaultValue"
    | "error"
    | "helperText"
  > {
  helperText?: RichTextEditorProps["helperText"];
}

export const RichTextEditorLoading = (props: RichTextEditorLoadingProps) => (
  <RichTextEditor
    {...props}
    disabled={true}
    readOnly={true}
    error={null}
    helperText={props.helperText ?? ""}
    defaultValue={{ blocks: [] }}
    editorRef={{ current: null }}
  />
);
