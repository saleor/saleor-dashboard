import EditorJS, { LogLevels, OutputData } from "@editorjs/editorjs";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import classNames from "classnames";
import Undo from "editorjs-undo";
import React from "react";

import { RichTextEditorContentProps, tools } from "./RichTextEditorContent";
import useStyles from "./styles";

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
  disabled,
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
      if (data) {
        editor.current = new EditorJS({
          data,
          holder: editorContainer.current,
          logLevel: "ERROR" as LogLevels,
          onChange: async api => {
            const savedData = await api.saver.save();
            onChange(savedData);
          },
          onReady: () => {
            const undo = new Undo({ editor });
            undo.initialize(data);
            if (onReady) {
              onReady();
            }
          },
          readOnly: disabled,
          tools
        });
      }

      return editor.current?.destroy;
    },
    // Rerender editor only if changed from undefined to defined state
    [data === undefined]
  );
  React.useEffect(() => {
    if (editor.current?.readOnly) {
      editor.current.readOnly.toggle(disabled);
    }
  }, [disabled]);

  return (
    <FormControl
      data-test="richTextEditor"
      data-test-id={name}
      disabled={disabled}
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
          [classes.rootDisabled]: disabled,
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
