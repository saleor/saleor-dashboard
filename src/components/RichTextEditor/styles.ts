import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@macaw-ui";

// @ts-expect-error - vanilla-extract vars type incompatible with MUI makeStyles
const useStyles = makeStyles(() => {
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
        background: vars.colors.background.accent1,
      },
      "& .ce-block__content": {
        margin: vars.spacing[1],
        maxWidth: "100%",
        paddingRight: vars.spacing[2],
      },
      "& .ce-ghost": {
        background: vars.colors.background.accent1,
        opacity: 0.5,
      },
      "& .ce-header": {
        fontWeight: vars.fontWeight.bold,
      },
      "& .ce-toolbar": {
        background: vars.colors.background.default1,
        border: `1px solid ${vars.colors.border.default1}`,
        borderRadius: vars.borderRadius[1],
      },
      "& .ce-toolbar__content": {
        maxWidth: "100%",
      },
      "& .ce-toolbar__plus-btn": {
        background: vars.colors.background.default1,
      },
      "& .ce-toolbar__plus": {
        background: vars.colors.background.default1,
        color: vars.colors.text.default1,
      },
      "& .ce-toolbar__plus-hovered": {
        background: vars.colors.background.default1,
        color: vars.colors.text.default1,
      },
      "& .ce-toolbar__more-btn": {
        background: vars.colors.background.default1,
        color: vars.colors.text.default1,
      },
      "& .cdx-search-field": {
        padding: vars.spacing[1],
      },
      "& .cdx-search-field__icon": {
        color: vars.colors.text.default2,
      },
      "& .cdx-search-field__input": {
        background: vars.colors.background.default1,
        border: `1px solid ${vars.colors.border.default1}`,
        borderRadius: vars.borderRadius[1],
        padding: vars.spacing[1],
      },
      background: vars.colors.background.default1,
      position: "relative",
    },
    root: {
      border: `1px solid ${vars.colors.border.default1}`,
      borderRadius: vars.borderRadius[1],
      fontSize: vars.fontSize[3],
      position: "relative",
      transition: vars.transitionDuration,
      padding: vars.spacing[1],
      paddingLeft: vars.spacing[2],
      "&:hover": {
        ...hover,
      },
    },
    rootActive: {
      ...hover,
    },
    rootDisabled: {
      opacity: 0.5,
      pointerEvents: "none",
    },
    rootError: {
      borderColor: vars.colors.critical2,
    },
    rootStatic: {
      "&:hover": {
        background: vars.colors.background.default1,
      },
      background: vars.colors.background.default1,
      border: `1px solid ${vars.colors.border.default1}`,
      color: vars.colors.text.defaultDisabled,
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
}, { name: "RichTextEditor" });

export default useStyles;
