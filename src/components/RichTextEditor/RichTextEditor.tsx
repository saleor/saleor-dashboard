import { LogLevels } from "@editorjs/editorjs";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { useId } from "@reach/auto-id";
import { Props as ReactEditorJSProps } from "@react-editor-js/core";
import classNames from "classnames";
import React from "react";
import { createReactEditorJS } from "react-editor-js";

import { tools } from "./consts";
import useStyles from "./styles";

export type EditorJsProps = Omit<ReactEditorJSProps, "factory">;

export interface RichTextEditorProps extends EditorJsProps {
  id?: string;
  disabled: boolean;
  error: boolean;
  helperText: string;
  label: string;
  name: string;
}

const ReactEditorJS = createReactEditorJS();

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id: defaultId,
  disabled,
  error,
  label,
  name,
  helperText,
  ...props
}) => {
  const classes = useStyles({});
  const id = useId(defaultId);
  const [isFocused, setIsFocused] = React.useState(false);

  // We need to render FormControl first to get id from @reach/auto-id
  const [hasRendered, setHasRendereed] = React.useState(false);

  React.useLayoutEffect(() => {
    setHasRendereed(true);
  }, []);

  return (
    <FormControl
      data-test-id={"rich-text-editor-" + name}
      disabled={disabled}
      error={error}
      fullWidth
      variant="outlined"
    >
      <InputLabel focused={true} shrink={true}>
        {label}
      </InputLabel>
      {hasRendered && (
        <ReactEditorJS
          // match with the id of holder div
          holder={id}
          tools={tools}
          // LogLeves is undefined at runtime
          logLevel={"ERROR" as LogLevels.ERROR}
          {...props}
        >
          <div
            id={id}
            className={classNames(classes.editor, classes.root, {
              [classes.rootActive]: isFocused,
              [classes.rootDisabled]: disabled,
              [classes.rootError]: error
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
