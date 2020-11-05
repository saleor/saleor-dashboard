import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import strikethroughIcon from "@saleor/icons/StrikethroughIcon";
import classNames from "classnames";
import createGenericInlineTool from "editorjs-inline-tool";
import React from "react";

export type RichTextEditorChange = (data: OutputData) => void;
export interface RichTextEditorProps {
  data: OutputData;
  disabled: boolean;
  error: boolean;
  helperText: string;
  label: string;
  name: string;
  onChange: RichTextEditorChange;
  onReady?: () => void;
}

// TODO: improve dark mode
const useStyles = makeStyles(
  theme => {
    const hover = {
      "&:hover": {
        background: fade(theme.palette.primary.main, 0.1)
      }
    };

    return {
      root: {
        "& .cdx-quote__text": {
          minHeight: 24
        },
        "& .ce-block--selected .ce-block__content": {
          background: `${fade(theme.palette.primary.main, 0.4)} !important`
        },
        "& .ce-block__content": {
          margin: 0,
          maxWidth: "unset"
        },
        "& .ce-conversion-tool": {
          ...hover
        },
        "& .ce-conversion-tool--focused": {
          background: `${fade(theme.palette.primary.main, 0.1)} !important`
        },
        "& .ce-conversion-tool__icon": {
          background: "none"
        },
        "& .ce-conversion-toolbar": {
          background: theme.palette.background.paper
        },
        "& .ce-header": {
          marginBottom: 0,
          paddingBottom: theme.spacing(1)
        },
        "& .ce-inline-tool": {
          ...hover,
          color: theme.palette.text.primary,
          height: 32,
          transition: theme.transitions.duration.short + "ms",
          width: 32
        },
        "& .ce-inline-toolbar": {
          "& input": {
            background: "none"
          },
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        },
        "& .ce-inline-toolbar__dropdown": {
          ...hover,
          height: 32,
          marginRight: 0
        },
        "& .ce-inline-toolbar__toggler-and-button-wrapper": {
          paddingRight: 0
        },
        "& .ce-toolbar__actions": {
          right: 0,
          top: 0
        },
        "& .ce-toolbar__content": {
          maxWidth: "unset"
        },
        "& .ce-toolbar__plus": {
          left: -9
        },
        "& .ce-toolbox.ce-toolbox--opened": {
          left: 16
        },
        "& .codex-editor__redactor": {
          marginRight: `${theme.spacing(4)}px !important`,
          paddingBottom: "0 !important"
        },
        "& a": {
          color: theme.palette.primary.light
        },
        "&:not($rootDisabled):hover": {
          borderColor: theme.palette.primary.main
        },
        border: `1px solid ${fade(theme.palette.text.secondary, 0.4)}`,
        borderRadius: 4,
        boxShadow: `inset 0 0 0 0 ${theme.palette.primary.main}`,
        fontSize: theme.typography.body1.fontSize,
        minHeight: 56,
        padding: theme.spacing(3, 2),
        paddingBottom: theme.spacing(),
        paddingLeft: 10,
        position: "relative",
        transition: theme.transitions.duration.short + "ms"
      },
      rootActive: {
        boxShadow: `inset 0px 0px 0 2px ${theme.palette.primary.main}`
      },
      rootDisabled: {
        ...theme.overrides.MuiOutlinedInput.root["&$disabled"]["& fieldset"]
      },
      rootError: {
        borderColor: theme.palette.error.main
      }
    };
  },
  { name: "RichTextEditor" }
);

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
          onChange: async api => {
            const savedData = await api.saver.save();
            onChange(savedData);
          },
          onReady,
          readOnly: disabled,
          tools: {
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
          }
        });
      }

      return editor.current?.destroy;
    },
    // Rerender editor only if changed from undefined to defined state
    [data === undefined]
  );
  React.useEffect(() => editor.current?.destroy, []);
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
        className={classNames(classes.root, {
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
