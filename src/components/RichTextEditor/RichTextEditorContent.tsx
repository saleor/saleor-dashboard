import { LogLevels } from "@editorjs/editorjs";
import { useId } from "@reach/auto-id";
import classNames from "classnames";
import React from "react";
import { createReactEditorJS } from "react-editor-js";

import { tools } from "./consts";
import { useHasRendered } from "./hooks";
import { EditorJsProps } from "./RichTextEditor";
import useStyles from "./styles";

export interface RichTextEditorContentProps
  extends Omit<EditorJsProps, "defaultValue"> {
  id?: string;
  className?: string;
}

const ReactEditorJS = createReactEditorJS();

const RichTextEditorContent: React.FC<RichTextEditorContentProps> = ({
  id: defaultId,
  className,
  value,
  ...props
}) => {
  const classes = useStyles({});
  const id = useId(defaultId);

  // We need to render FormControl first to get id from @reach/auto-id
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
      <div
        id={id}
        className={classNames(classes.editor, classes.rootStatic, className)}
      />
    </ReactEditorJS>
  );
};

RichTextEditorContent.displayName = "RichTextEditorContent";
export default RichTextEditorContent;
