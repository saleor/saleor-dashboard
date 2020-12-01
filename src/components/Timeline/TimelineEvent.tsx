import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import React from "react";

import { DateTime } from "../Date";

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: theme.spacing(),
      marginLeft: theme.spacing(3),
      width: "100%"
    },
    date: {
      color: theme.typography.caption.color
    },
    dateExpander: {
      color: theme.typography.caption.color,
      position: "absolute",
      right: 0
    },
    dot: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "100%",
      height: 8,
      left: -29,
      position: "absolute",
      top: 6,
      width: 8
    },
    expanded: {},
    noExpander: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      width: "100%"
    },
    panel: {
      "&$expanded": {
        margin: 0
      },
      "&:before": {
        display: "none"
      },
      background: "none",
      margin: 0,
      width: "100%"
    },
    panelExpander: {
      "&$expanded": {
        margin: 0,
        minHeight: 0
      },
      "&> .MuiExpansionPanelSummary-content": {
        margin: 0
      },
      "&> .MuiExpansionPanelSummary-expandIcon": {
        padding: 0,
        right: theme.spacing(18)
      },
      margin: 0
    },
    root: {
      "&:last-child:after": {
        background: theme.palette.background.default,
        content: "''",
        height: "calc(50% - 4px)",
        left: -theme.spacing(3) - 2,
        position: "absolute",
        top: "calc(50% + 4px)",
        width: "2px"
      },
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
      position: "relative",
      width: "100%"
    },
    secondaryTitle: {
      color: "#9e9e9e",
      fontSize: 14,
      marginTop: theme.spacing(2)
    }
  }),
  { name: "TimelineEvent" }
);

interface TimelineEventProps {
  children?: React.ReactNode;
  date: string;
  secondaryTitle?: string;
  title: string;
}

export const TimelineEvent: React.FC<TimelineEventProps> = props => {
  const { children, date, secondaryTitle, title } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <span className={classes.dot} />
      {children ? (
        <ExpansionPanel
          className={classNames(classes.panel, classes.expanded)}
          elevation={0}
        >
          <ExpansionPanelSummary
            className={classNames(classes.panelExpander, classes.expanded)}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{title}</Typography>
            <Typography className={classes.dateExpander}>
              <DateTime date={date} />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{children}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ) : (
        <div className={classes.container}>
          <div className={classes.noExpander}>
            <Typography>{title}</Typography>
            <Typography className={classes.date}>
              <DateTime date={date} />
            </Typography>
          </div>
          {secondaryTitle && (
            <div className={classes.noExpander}>
              <Typography className={classes.secondaryTitle}>
                {secondaryTitle}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
TimelineEvent.displayName = "TimelineEvent";
export default TimelineEvent;
