import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

const useStyles = makeStyles(
  theme => {
    const hover = {
      "&:hover": {
        background: vars.colors.background.default1Hovered,
      },
    };

    return {
      editor: {
        "& .codex-editor": {
          zIndex: 2,
        },
        "& .cdx-quote__text": {
          minHeight: 24,
        },
        "& .ce-block--selected .ce-block__content": {
          background: `${vars.colors.background.default1Pressed} !important`,
        },
        "& .ce-block__content": {
          margin: 0,
          maxWidth: "unset",
          paddingRight: "54px",
        },
        "& .ce-conversion-tool": {
          ...hover,
        },
        "& .ce-conversion-tool--focused": {
          background: `${vars.colors.background.default1Hovered} !important`,
        },
        "& .ce-conversion-tool__icon": {
          background: "none",
        },
        "& .ce-conversion-toolbar": {
          background: theme.palette.background.paper,
        },
        "& .ce-header": {
          marginBottom: 0,
          paddingBottom: theme.spacing(1),
        },
        "& .ce-inline-tool": {
          ...hover,
          color: theme.palette.text.primary,
          height: 32,
          transition: theme.transitions.duration.short + "ms",
          width: 32,
        },
        "& .ce-inline-toolbar": {
          "& input": {
            background: "none",
          },
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
        "& .ce-inline-toolbar__dropdown": {
          ...hover,
          height: 32,
          marginRight: 0,
        },
        "& .ce-inline-toolbar__toggler-and-button-wrapper": {
          paddingRight: 0,
        },
        "& .ce-toolbar__actions": {
          right: 0,
          top: 0,
        },
        "& .ce-toolbar__content": {
          maxWidth: "unset",
        },
        "& .ce-toolbar__plus": {
          left: -9,
          color: theme.palette.text.primary,
          ...hover,
        },
        "& .ce-popover": {
          backgroundColor: vars.colors.background.default1,
          position: "absolute",
          top: 0,
          left: "-186px",
        },
        "& .ce-settings": {
          position: "absolute",
          left: "-56px",
        },
        "& .ce-popover__item": {
          ...hover,
        },
        "& .ce-popover__item-icon": {
          color: vars.colors.text.default1,
          backgroundColor: vars.colors.background.default1,
        },

        "& .codex-editor__loader": {
          height: "30px",
        },
        "& .ce-toolbox.ce-toolbox--opened": {
          left: 16,
        },
        "& .codex-editor__redactor": {
          marginRight: `${theme.spacing(4)}px !important`,
          paddingBottom: "0 !important",
        },
        "& a": {
          color: vars.colors.text.accent1,
        },
        "& .ce-popover__item--focused": {
          background: `${vars.colors.background.default1Hovered} !important`,
        },
        "& .cdx-search-field": {
          backgroundColor: vars.colors.background.default1,
        },
      },
      root: {
        border: `1px solid ${vars.colors.border.default1}`,
        borderRadius: vars.borderRadius[3],
        fontSize: vars.fontSize[4],
        position: "relative",
        transition: theme.transitions.duration.short + "ms",
        padding: theme.spacing(0, 2),
        paddingLeft: vars.spacing[2],
        "&:hover": {
          border: `1px solid ${vars.colors.border.default1}`,
        },
      },
      rootActive: {
        border: `1px solid ${vars.colors.border.accent1} !important`,
        backgroundColor: `${vars.colors.background.default1} !important`,
      },
      rootDisabled: {
        pointerEvents: "none",
        backgroundColor: vars.colors.background.default1,
        border: `1px solid ${vars.colors.border.default1}`,
        color: vars.colors.text.defaultDisabled,
      },
      rootError: {
        backgroundColor: vars.colors.background.critical2,
      },
      rootStatic: {
        fontSize: theme.typography.body1.fontSize,
      },
      labelRoot: {
        marginLeft: "-4px",
        color: `${vars.colors.text.default2} !important`,
      },
      labelError: {
        color: `${vars.colors.text.critical2} !important`,
      },
      rootErrorFocus: {
        border: "1px solid transparent !important",
      },
      labelDisabled: {
        color: `${vars.colors.text.defaultDisabled} !important`,
      },
      rootTyped: {
        backgroundColor: vars.colors.background.default1,
      },
      rootHasLabel: {
        minHeight: 56,
        padding: `${vars.spacing[6]} ${vars.spacing[2]}`,
        paddingBottom: vars.spacing[1.5],
      },
    };
  },
  { name: "RichTextEditor" },
);

export default useStyles;
