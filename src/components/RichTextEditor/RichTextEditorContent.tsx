import { type LogLevels } from "@editorjs/editorjs";
import clsx from "clsx";
import { useId } from "react";
import { createReactEditorJS } from "react-editor-js";

import { tools } from "./consts";
import { useHasRendered } from "./hooks";
import { type EditorJsProps } from "./RichTextEditor";
import useStyles from "./styles";

interface RichTextEditorContentProps extends Omit<EditorJsProps, "defaultValue"> {
  id?: string;
  className?: string;
}

const ReactEditorJS = createReactEditorJS();
const RichTextEditorContent = ({
  id: defaultId,
  className,
  value,
  ...props
}: RichTextEditorContentProps) => {
  const classes = useStyles({});
  const generatedId = useId();
  const id = defaultId ?? generatedId;
  // Delay EditorJS rendering until after mount to avoid client-only rendering issues.
  const hasRendered = useHasRendered();

  if (!hasRendered) {
    return <div />;
  }

  return (
    <ReactEditorJS
      holder={id}
      logLevel={"ERROR" as LogLevels.ERROR}
      tools={tools}
      {...props}
      defaultValue={value}
      readOnly={true}
    >
      <div id={id} className={clsx(classes.editor, classes.rootStatic, className)} />
    </ReactEditorJS>
  );
};

RichTextEditorContent.displayName = "RichTextEditorContent";
export default RichTextEditorContent;
