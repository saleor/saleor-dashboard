import { LogLevels } from "@editorjs/editorjs";
import { useId } from "@reach/auto-id";
import classNames from "classnames";
import React from "react";
import { createReactEditorJS } from "react-editor-js";

import { tools } from "./consts";
import { EditorJsProps } from "./RichTextEditor";
import useStyles from "./styles";

export interface RichTextEditorContentProps extends EditorJsProps {
  id?: string;
  className?: string;
}

const ReactEditorJS = createReactEditorJS();

const RichTextEditorContent: React.FC<RichTextEditorContentProps> = ({
  id: defaultId,
  className
}) => {
  const classes = useStyles({});
  const id = useId(defaultId);

  return (
    <ReactEditorJS
      holder={id}
      logLevel={"ERROR" as LogLevels.ERROR}
      tools={tools}
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
