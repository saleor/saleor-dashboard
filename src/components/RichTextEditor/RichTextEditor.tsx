import EditorJS, { LogLevels, OutputData } from "@editorjs/editorjs";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import classNames from "classnames";
import React from "react";

import { RichTextEditorContentProps, tools } from "./RichTextEditorContent";
import useStyles from "./styles";
import { clean } from "./utils";

export type RichTextEditorChange = (data: OutputData) => void;
export interface RichTextEditorProps extends RichTextEditorContentProps {
  disabled: boolean;
  error: boolean;
  helperText: string;
  label: string;
  name: string;
  onChange: RichTextEditorChange;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  data,
  error,
  helperText,
  label,
  name,
  onChange,
  onReady
}) => {
  const classes = useStyles({});

  const [isFocused, setFocus] = React.useState(false);
  const editor = React.useRef<EditorJS>();
  const editorContainer = React.useRef<HTMLDivElement>();

  React.useEffect(
    () => {
      if (data !== undefined && !editor.current) {
        editor.current = new EditorJS({
          data,
          holder: editorContainer.current,
          logLevel: "ERROR" as LogLevels,
          onChange: async api => {
            const savedData = await api.saver.save();
            onChange(savedData);
          },
          onReady: () => {
            // FIXME: This throws an error and is not working
            // const undo = new Undo({ editor });
            // undo.initialize(data);

            if (onReady) {
              onReady();
            }
          },
          tools
        });
      }

      return () => {
        clean(editor.current);
        editor.current = null;
      };
    },
    // Rerender editor only if changed from undefined to defined state
    [data === undefined]
  );

  return (
    <FormControl
      data-test-id={"rich-text-editor-" + name}
      error={error}
      fullWidth
      variant="outlined"
    >
      <InputLabel focused={true} shrink={true}>
        {label}
      </InputLabel>
      <div
        className={classNames(classes.editor, classes.root, {
          [classes.rootActive]: isFocused,
          [classes.rootError]: error
        })}
        ref={editorContainer}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
