import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
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

const useStyles = makeStyles(
  theme => {
    const hover = {
      "&:hover": {
        background: fade(theme.palette.primary.main, 0.1)
      }
    };

    return {
      error: {
        color: theme.palette.error.main
      },
      helperText: {
        marginTop: theme.spacing(0.75)
      },
      label: {
        color: theme.palette.text.secondary,
        position: "absolute",
        top: theme.spacing(1),
        transition: theme.transitions.duration.short + "ms"
      },
      labelActive: {
        color: theme.palette.primary.main
      },
      root: {
        "& .cdx-quote__text": {
          minHeight: 24
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
        "& .ce-inline-tool": {
          ...hover,
          height: 32,
          transition: theme.transitions.duration.short + "ms",
          width: 32
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
        "&:hover": {
          borderColor: theme.palette.primary.main
        },
        border: `1px solid ${fade(theme.palette.text.secondary, 0.4)}`,
        borderRadius: 4,
        boxShadow: `inset 0 0 0 0 ${theme.palette.primary.main}`,
        fontSize: theme.typography.body1.fontSize,
        padding: theme.spacing(3, 2),
        paddingBottom: theme.spacing(),
        paddingLeft: 10,
        position: "relative",
        transition: theme.transitions.duration.short + "ms"
      },
      rootActive: {
        boxShadow: `inset 0px 0px 0 2px ${theme.palette.primary.main}`
      }
    };
  },
  { name: "RichTextEditor" }
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  data,
  error,
  helperText,
  label,
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
                s: true
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

  return (
    <div>
      <div
        className={classNames(classes.root, {
          [classes.rootActive]: isFocused
        })}
        ref={editorContainer}
        data-test="richTextEditor"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        <Typography
          className={classNames(classes.label, {
            [classes.labelActive]: isFocused
          })}
          variant="caption"
        >
          {label}
        </Typography>
      </div>
      {helperText && (
        <Typography
          className={classNames({
            [classes.error]: error,
            [classes.helperText]: true
          })}
          variant="caption"
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
