import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

const useStyles = makeStyles(
  theme => {
    const hover = {
      "&:hover": {
        background: vars.colors.background.interactiveNeutralHighlightHovering,
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
          background: `${vars.colors.background.interactiveNeutralHighlightPressing} !important`,
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
          background: `${vars.colors.background.interactiveNeutralHighlightHovering} !important`,
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
          backgroundColor: vars.colors.background.surfaceNeutralPlain,
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
          color: vars.colors.foreground.iconNeutralDefault,
          backgroundColor: vars.colors.background.surfaceNeutralPlain,
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
          color: vars.colors.foreground.textBrandDefault,
        },
        "& .ce-popover__item--focused": {
          background: `${vars.colors.background.interactiveNeutralHighlightHovering} !important`,
        },
        "& .cdx-search-field": {
          backgroundColor: vars.colors.background.surfaceNeutralPlain,
        },
      },
      root: {
        border: "1px solid transparent",
        borderRadius: vars.borderRadius[3],
        fontSize: vars.fontSize.bodyMedium,
        backgroundColor: vars.colors.background.surfaceNeutralHighlight,
        minHeight: 56,
        position: "relative",
        transition: theme.transitions.duration.short + "ms",
        padding: theme.spacing(3, 2),
        paddingBottom: theme.spacing(),
        paddingLeft: vars.spacing[4],
        "&:hover": {
          border: `1px solid ${vars.colors.border.neutralHighlight}`,
        },
      },
      rootActive: {
        border: `1px solid ${vars.colors.border.brandSubdued} !important`,
        backgroundColor: `${vars.colors.background.interactiveNeutralHighlightDefault} !important`,
      },
      rootDisabled: {
        pointerEvents: "none",
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
        border: `1px solid ${vars.colors.border.neutralHighlight}`,
        color: vars.colors.foreground.textNeutralDisabled,
      },
      rootError: {
        backgroundColor: vars.colors.background.surfaceCriticalSubdued,
      },
      rootStatic: {
        fontSize: theme.typography.body1.fontSize,
      },
      labelRoot: {
        marginLeft: "-6px",
        color: `${vars.colors.foreground.textNeutralSubdued} !important`,
      },
      labelError: {
        color: `${vars.colors.foreground.textCriticalSubdued} !important`,
      },
      rootErrorFocus: {
        border: "1px solid transparent !important",
      },
      labelDisabled: {
        color: `${vars.colors.foreground.textNeutralDisabled} !important`,
      },
      rootTyped: {
        backgroundColor: vars.colors.background.surfaceNeutralPlain,
      },
    };
  },
  { name: "RichTextEditor" },
);

export default useStyles;
