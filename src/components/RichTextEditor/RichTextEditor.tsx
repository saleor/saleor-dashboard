import { type LogLevels, type OutputData } from "@editorjs/editorjs";
import { FormControl, FormHelperText } from "@material-ui/core";
import { type EditorCore, type Props as ReactEditorJSProps } from "@react-editor-js/core";
import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";

import { tools } from "./consts";
import { useHasRendered, useUpdateOnRerender } from "./hooks";
import { ReactEditorJS } from "./ReactEditorJS";
import useStyles from "./styles";

export type EditorJsProps = Omit<ReactEditorJSProps, "factory">;

export interface RichTextEditorProps extends Omit<EditorJsProps, "onChange"> {
  id?: string;
  disabled: boolean;
  error: boolean;
  helperText?: string;
  label: string;
  name: string;
  editorRef: React.RefCallback<EditorCore> | React.MutableRefObject<EditorCore | null> | null;
  // onChange with value shouldn't be used due to issues with React and EditorJS integration
  onChange?: (data?: OutputData) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDownCapture?: React.KeyboardEventHandler<HTMLDivElement>;
}

const RichTextEditor = ({
  id: defaultId,
  disabled,
  error,
  label,
  name,
  helperText,
  editorRef,
  onInitialize,
  onChange,
  onBlur,
  onFocus,
  onKeyDownCapture,
  ...props
}: RichTextEditorProps) => {
  const classes = useStyles({});
  const generatedId = React.useId();
  const id = defaultId ?? generatedId;
  const ref = React.useRef<EditorCore | null>(null);
  const renderRef = React.useRef<EditorCore["render"] | undefined>(undefined);
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const isTyped = Boolean(hasValue || isFocused);
  const handleInitialize = React.useCallback((editor: EditorCore) => {
    if (onInitialize) {
      onInitialize(editor);
    }

    ref.current = editor;
    renderRef.current = editor.render.bind(editor);
    setIsEditorReady(true);

    if (typeof editorRef === "function") {
      return editorRef(editor);
    }

    if (editorRef) {
      return (editorRef.current = editor);
    }
  }, []);
  // Wait until after the initial render before running rerender-dependent editor updates.
  const hasRendered = useHasRendered();

  // EditorJS does not rerender when default value changes,
  // so we need to manually update it
  useUpdateOnRerender({
    renderRef,
    defaultValue: props.defaultValue,
    hasRendered,
    isEditorReady,
  });

  return (
    <FormControl
      data-test-id={"rich-text-editor-" + name}
      disabled={disabled}
      error={error}
      fullWidth
      variant="outlined"
    >
      <Box
        as="label"
        color={error ? "critical2" : "default2"}
        fontWeight="regular"
        size={1}
        position="absolute"
        htmlFor={id}
        zIndex="2"
        __top={9}
        __left={9}
      >
        {label}
      </Box>
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

            return onChange?.(editorJsValue);
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
              [classes.rootHasLabel]: label !== "",
              [classes.rootTyped]: isTyped || props.defaultValue?.blocks?.length! > 0,
            })}
            onFocusCapture={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlurCapture={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onKeyDownCapture={onKeyDownCapture}
          />
        </ReactEditorJS>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
