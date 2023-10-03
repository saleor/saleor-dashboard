// @ts-strict-ignore
import { LogLevels } from "@editorjs/editorjs";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { useId } from "@reach/auto-id";
import { EditorCore, Props as ReactEditorJSProps } from "@react-editor-js/core";
import clsx from "clsx";
import React from "react";

import { tools } from "./consts";
import { useHasRendered } from "./hooks";
import { ReactEditorJS } from "./ReactEditorJS";
import useStyles from "./styles";

export type EditorJsProps = Omit<ReactEditorJSProps, "factory">;

export interface RichTextEditorProps extends Omit<EditorJsProps, "onChange"> {
  id?: string;
  disabled: boolean;
  error: boolean;
  helperText: string;
  label: string;
  name: string;
  editorRef:
    | React.RefCallback<EditorCore>
    | React.MutableRefObject<EditorCore>
    | null;
  // onChange with value shouldn't be used due to issues with React and EditorJS integration
  onChange?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id: defaultId,
  disabled,
  error,
  label,
  name,
  helperText,
  editorRef,
  onInitialize,
  onChange,
  ...props
}) => {
  const classes = useStyles({});
  const id = useId(defaultId);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const isTyped = Boolean(hasValue || isFocused);

  const handleInitialize = React.useCallback((editor: EditorCore) => {
    if (onInitialize) {
      onInitialize(editor);
    }

    if (typeof editorRef === "function") {
      return editorRef(editor);
    }
    if (editorRef) {
      return (editorRef.current = editor);
    }
  }, []);

  // We need to render FormControl first to get id from @reach/auto-id
  const hasRendered = useHasRendered();

  return (
    <FormControl
      data-test-id={"rich-text-editor-" + name}
      disabled={disabled}
      error={error}
      fullWidth
      variant="outlined"
    >
      <InputLabel
        focused={true}
        shrink={true}
        classes={{
          disabled: classes.labelDisabled,
          error: classes.labelError,
          root: classes.labelRoot,
        }}
        error={error}
        disabled={disabled}
      >
        {label}
      </InputLabel>
      {hasRendered && (
        <ReactEditorJS
          // match with the id of holder div
          holder={id}
          tools={tools}
          // Log level is undefined at runtime
          logLevel={"ERROR" as LogLevels.ERROR}
          onInitialize={handleInitialize}
          onChange={async event => {
            const editorJsValue = await event.saver.save();
            setHasValue(editorJsValue.blocks.length > 0);
            return onChange?.();
          }}
          {...props}
        >
          <div
            id={id}
            className={clsx(classes.editor, classes.root, {
              [classes.rootErrorFocus]: isFocused && error,
              [classes.rootActive]: isFocused,
              [classes.rootDisabled]: disabled,
              [classes.rootError]: error,
              [classes.rootTyped]:
                isTyped || props.defaultValue?.blocks?.length > 0,
            })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </ReactEditorJS>
      )}
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
