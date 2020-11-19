import EditorJS, {
  LogLevels,
  OutputData,
  ToolConstructable,
  ToolSettings
} from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import strikethroughIcon from "@saleor/icons/StrikethroughIcon";
import classNames from "classnames";
import createGenericInlineTool from "editorjs-inline-tool";
import React from "react";

import useStyles from "./styles";

export interface RichTextEditorContentProps {
  className?: string;
  data: OutputData;
  onReady?: () => void;
}

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  header: {
    class: Header,
    config: {
      defaultLevel: 1,
      levels: [1, 2, 3]
    }
  },
  list: List,
  quote: Quote,
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {}
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: strikethroughIcon
  })
};

const RichTextEditorContent: React.FC<RichTextEditorContentProps> = ({
  className,
  data,
  onReady
}) => {
  const classes = useStyles({});

  const editor = React.useRef<EditorJS>();
  const editorContainer = React.useRef<HTMLDivElement>();
  React.useEffect(
    () => {
      if (data) {
        editor.current = new EditorJS({
          data,
          holder: editorContainer.current,
          logLevel: "ERROR" as LogLevels,
          onReady,
          readOnly: true,
          tools
        });
      }

      return editor.current?.destroy;
    },
    // Rerender editor only if changed from undefined to defined state
    [data === undefined]
  );

  return (
    <div
      className={classNames(classes.editor, className)}
      ref={editorContainer}
    />
  );
};

RichTextEditorContent.displayName = "RichTextEditorContent";
export default RichTextEditorContent;
