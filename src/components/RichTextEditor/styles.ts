import { alpha } from "@material-ui/core/styles";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => {
    const hover = {
      "&:hover": {
        background: alpha(theme.palette.primary.main, 0.1),
      },
    };

    const isDarkMode = theme.palette.type === "dark";

    return {
      editor: {
        "& .codex-editor": {
          zIndex: 2,
        },
        "& .cdx-quote__text": {
          minHeight: 24,
        },
        "& .ce-block--selected .ce-block__content": {
          background: `${alpha(theme.palette.primary.main, 0.2)} !important`,
        },
        "& .ce-block__content": {
          margin: 0,
          maxWidth: "unset",
        },
        "& .ce-conversion-tool": {
          ...hover,
        },
        "& .ce-conversion-tool--focused": {
          background: `${alpha(theme.palette.primary.main, 0.1)} !important`,
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
          backgroundColor: theme.palette.background.paper,
        },
        "& .ce-popover__item": {
          ...hover,
        },
        "& .ce-popover__item-icon": {
          color: theme.palette.saleor.generic.verydark,
        },
        "& .ce-toolbox.ce-toolbox--opened": {
          left: 16,
        },
        "& .codex-editor__redactor": {
          marginRight: `${theme.spacing(4)}px !important`,
          paddingBottom: "0 !important",
        },
        "& a": {
          color: theme.palette.primary.light,
        },
        "&:not($rootDisabled):hover": {
          borderColor: isDarkMode
            ? theme.palette.saleor.main[2]
            : theme.palette.saleor.main[4],
          boxShadow: `0 0 0 3px ${
            isDarkMode
              ? theme.palette.saleor.main[4]
              : theme.palette.saleor.main[6]
          }`,
        },
      },
      root: {
        border: `1px solid ${theme.palette.saleor.main[4]}`,
        borderRadius: 4,
        fontSize: theme.typography.body1.fontSize,
        minHeight: 56,
        padding: theme.spacing(3, 2),
        paddingBottom: theme.spacing(),
        paddingLeft: 10,
        position: "relative",
        transition: theme.transitions.duration.short + "ms",
      },
      rootActive: {
        borderColor: theme.palette.saleor.main[1],
      },
      rootDisabled: {
        ...theme.overrides.MuiOutlinedInput.root["&$disabled"]["& fieldset"],
        background: theme.palette.background.default,
        color: theme.palette.saleor.main[4],
      },
      rootError: {
        borderColor: theme.palette.error.main,
      },
      rootStatic: {
        fontSize: theme.typography.body1.fontSize,
      },
    };
  },
  { name: "RichTextEditor" },
);

export default useStyles;
