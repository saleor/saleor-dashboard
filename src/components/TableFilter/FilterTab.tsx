import { Tab } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { type ReactNode } from "react";

const useStyles = makeStyles(
  theme => ({
    selectedTabLabel: {
      "&$tabLabel": {
        color: theme.palette.text.primary,
      },
    },
    tabLabel: {
      "&:hover": {
        color: theme.palette.text.primary,
      },
      // `text.secondary` is dimmer than active text but not as gray as `text.disabled`,
      // so inactive tabs read as "less prominent" rather than "unavailable".
      color: theme.palette.text.secondary,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: 500,
    },
    // Force a single-line, row-oriented layout for label + count.
    // MUI's default `Tab > .wrapper` is `flex-direction: column` (so icons can stack
    // above text); our label + count fragment needs them inline, no wrapping.
    tabContent: {
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "baseline",
      whiteSpace: "nowrap",
      // Prevent overgrown labels from blowing out the tab strip layout.
      maxWidth: 220,
    },
    tabLabelText: {
      // Ellipsis truncation for the label only — counts stay visible at the end.
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0,
    },
    tabCount: {
      // Counts always use the secondary tone so the active label still stands out.
      color: theme.palette.text.secondary,
      fontWeight: 500,
      marginLeft: theme.spacing(0.5),
      flexShrink: 0,
    },
    // Slot for a small marker icon (e.g. a pin glyph for pinned tabs). Rendered
    // before the label, slightly raised relative to the baseline-aligned label
    // so it visually centers with the cap height of the text.
    tabLeadingIcon: {
      alignSelf: "center",
      display: "inline-flex",
      flexShrink: 0,
      // Inherit the tab's current text color (active vs inactive) but always
      // dim the marker so it reads as metadata, not as a primary glyph.
      color: theme.palette.text.disabled,
      marginRight: theme.spacing(0.75),
    },
    tabRoot: {
      minWidth: "80px",
      opacity: 1,
      paddingTop: theme.spacing(1),
      textTransform: "initial" as const,
    },
  }),
  { name: "FilterTab" },
);

interface FilterTabProps {
  onClick: () => void;
  label: string;
  /**
   * Optional badge-like number rendered next to the label, e.g. "Brand (5)".
   * Always rendered in a muted color so the label remains the dominant element.
   */
  count?: number;
  /**
   * Optional small marker rendered before the label. Useful for surfacing
   * subtle metadata on a tab (e.g. a pin glyph for pinned tabs, à la Chrome).
   * Keep it tiny (≤ 12px) and let the component dim it via `text.disabled`.
   */
  leadingIcon?: ReactNode;
  selected?: boolean;
  value?: number;
}

export const FilterTab = (props: FilterTabProps) => {
  const { onClick, label, count, leadingIcon, selected, value } = props;
  const classes = useStyles(props);
  const tabContent = (
    <span className={classes.tabContent} title={label}>
      {leadingIcon && (
        <span className={classes.tabLeadingIcon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className={classes.tabLabelText}>{label}</span>
      {count !== undefined && <span className={classes.tabCount}>({count})</span>}
    </span>
  );

  return (
    <Tab
      disableRipple
      label={tabContent}
      classes={{
        root: classes.tabRoot,
        wrapper: clsx(classes.tabLabel, {
          [classes.selectedTabLabel]: selected,
        }),
      }}
      onClick={onClick}
      value={value}
    />
  );
};
FilterTab.displayName = "FilterTab";
export default FilterTab;
