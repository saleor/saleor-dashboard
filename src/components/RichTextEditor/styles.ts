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
          background: vars.colors.background.default1,
          color: vars.colors.text.default1,
        },
        "& .ce-header": {
          marginBottom: 0,
          paddingBottom: theme.spacing(1),
        },
        "& .ce-inline-tool": {
          ...hover,
          color: vars.colors.text.default1,
          height: 32,
          transition: theme.transitions.duration.short + "ms",
          width: 32,
        },
        "& .ce-inline-toolbar": {
          "& input": {
            background: "none",
            color: vars.colors.text.default1,
          },
          background: vars.colors.background.default1,
          color: vars.colors.text.default1,
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
          color: vars.colors.text.default1,
          ...hover,
        },
        "& .ce-popover": {
          // EditorJS exposes its popover palette as CSS custom properties on .ce-popover.
          // The visible background is .ce-popover__container { background: var(--color-background) },
          // so we have to override the vars rather than the popover element itself.
          "--color-background": vars.colors.background.default1,
          "--color-text-primary": vars.colors.text.default1,
          "--color-text-secondary": vars.colors.text.default2,
          "--color-border": vars.colors.border.default1,
          "--color-background-item-hover": vars.colors.background.default1Hovered,
          "--color-background-item-focus": vars.colors.background.default1Focused,
          backgroundColor: vars.colors.background.default1,
        },
        "& .ce-popover__items": {
          // Adding the Table tool pushed the toolbox past the popover's max-height.
          // Allow the list to scroll instead of clipping the overflowing items.
          overflowY: "auto",
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
        // @editorjs/table theming overrides.
        // The plugin hardcodes light-theme colors and exposes them as CSS custom
        // properties scoped to .tc-wrap / .tc-popover / .tc-toolbox. As with the
        // .ce-popover block above, we override the vars (not the elements) so the
        // table reads correctly in light and dark mode. The row/column settings
        // popover mounts inside the editor holder, so it is themed here, not in "@global".
        "& .tc-wrap": {
          "--color-background": vars.colors.background.default1,
          "--color-border": vars.colors.border.default1,
          "--color-text-secondary": vars.colors.text.default2,
          // Cell content is contenteditable and otherwise falls back to the browser
          // default (black), unreadable on a dark surface — pin it to the theme text color.
          color: vars.colors.text.default1,
        },
        // Row/column drag handle ("::" dots). The hovered color is hardcoded near-black,
        // invisible in dark mode.
        "& .tc-toolbox": {
          "--toggler-dots-color": vars.colors.text.default2,
          "--toggler-dots-color-hovered": vars.colors.text.default1,
          // The toolbox (z-index:1, position:absolute) forms a stacking context below the
          // sticky header row (.tc-row:first-child, z-index:2), so its settings popover gets
          // covered by the header. Lift the whole toolbox above the header.
          zIndex: 3,
        },
        // Row/column settings menu.
        "& .tc-popover": {
          "--color-background": vars.colors.background.default1,
          "--color-border": vars.colors.border.default1,
          "--color-background-hover": vars.colors.background.default1Hovered,
          color: vars.colors.text.default1,
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
      // EditorJS renders tooltips into document.body, so we need to style them globally.
      // Default colors are hardcoded in the library and lack contrast in dark mode.
      // buttonDefaultPrimary auto-inverts across themes, so the tooltip always pops:
      // light mode → dark tooltip + light text, dark mode → light tooltip + dark text.
      "@global": {
        ".ct:before, .ct:after": {
          backgroundColor: `${vars.colors.background.buttonDefaultPrimary} !important`,
        },
        ".ct__content": {
          color: `${vars.colors.text.buttonDefaultPrimary} !important`,
        },
        // Override EditorJS's hardcoded light-blue text selection (looks too bright in dark mode).
        // Split into two rules — combining ::selection and ::-moz-selection in one comma list
        // invalidates the whole rule in browsers that don't recognise the other pseudo-element.
        ".codex-editor ::selection": {
          backgroundColor: `${vars.colors.background.accent1Pressed} !important`,
        },
        ".codex-editor ::-moz-selection": {
          backgroundColor: `${vars.colors.background.accent1Pressed} !important`,
        },
      },
    };
  },
  { name: "RichTextEditor" },
);

export default useStyles;
