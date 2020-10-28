import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import { FormChange } from "@saleor/hooks/useForm";
import strikethroughIcon from "@saleor/icons/StrikethroughIcon";
import classNames from "classnames";
import createGenericInlineTool from "editorjs-inline-tool";
import React from "react";

export interface RichTextEditorProps {
  disabled: boolean;
  error: boolean;
  helperText: string;
  // TODO: Remove any type
  initial: OutputData | any;
  label: string;
  name: string;
  onChange: FormChange;
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
        top: theme.spacing(4),
        transition: theme.transitions.duration.short + "ms"
      },
      labelActive: {
        color: theme.palette.primary.main
      },
      root: {
        "& .cdx-quote__text": {
          minHeight: 24
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
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        boxShadow: `inset 0 0 0 0 ${theme.palette.primary.main}`,
        padding: theme.spacing(3, 2),
        transition: theme.transitions.duration.short + "ms"
      },
      rootActive: {
        boxShadow: `inset 0px 0px 0 2px ${theme.palette.primary.main}`
      }
    };
  },
  { name: "RichTextEditor" }
);

class NewEditor extends EditorJS {}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  error,
  helperText,
  initial,
  label
}) => {
  const classes = useStyles({});

  const [isFocused, setFocus] = React.useState(false);
  const editor = React.useRef<EditorJS>();
  const editorContainer = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    editor.current = new NewEditor({
      data: initial,
      holder: editorContainer.current,
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
  }, []);
  React.useEffect(() => () => editor.current.destroy(), []);

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
