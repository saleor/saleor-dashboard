import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import TimelineEventHeader, { TitleElement } from "./TimelineEventHeader";

const useStyles = makeStyles(
  theme => ({
    dot: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "100%",
      height: 8,
      left: -29,
      position: "absolute",
      top: 6,
      width: 8,
    },
    panel: {
      "& .MuiAccordionDetails-root": {
        padding: 0,
        paddingTop: theme.spacing(2),
      },
      "&.Mui-expanded": {
        margin: 0,
        minHeight: 0,
      },
      "&:before": {
        display: "none",
      },
      background: "none",
      display: "",
      margin: 0,
      minHeight: 0,
      width: "100%",
    },
    panelExpander: {
      "&.MuiAccordionSummary-root.Mui-expanded": {
        minHeight: 0,
      },
      "&> .MuiAccordionSummary-content": {
        margin: 0,
      },
      "&> .MuiAccordionSummary-expandIcon": {
        padding: 0,
        position: "absolute",
        right: theme.spacing(20),
      },
      margin: 0,
      minHeight: 0,
      padding: 0,
    },
    root: {
      "&:last-child:after": {
        background: theme.palette.background.default,
        content: "''",
        height: "calc(50% - 4px)",
        left: -26,
        position: "absolute",
        top: "calc(50% + 4px)",
        width: "2px",
      },
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(3),
      marginTop: 0,
      position: "relative",
      width: "100%",
    },
  }),
  { name: "TimelineEvent" },
);

export interface TimelineEventProps {
  children?: React.ReactNode;
  date: string;
  secondaryTitle?: string;
  title?: React.ReactNode;
  titleElements?: TitleElement[];
}

export const TimelineEvent: React.FC<TimelineEventProps> = props => {
  const { children, date, secondaryTitle, title, titleElements } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <span className={classes.dot} />
      {children ? (
        <Accordion className={classes.panel} elevation={0}>
          <AccordionSummary
            className={classes.panelExpander}
            expandIcon={<ExpandMoreIcon />}
          >
            <TimelineEventHeader
              title={title}
              date={date}
              titleElements={titleElements}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{children}</Typography>
          </AccordionDetails>
        </Accordion>
      ) : (
        <TimelineEventHeader
          title={title}
          titleElements={titleElements}
          secondaryTitle={secondaryTitle}
          date={date}
        />
      )}
    </div>
  );
};
TimelineEvent.displayName = "TimelineEvent";
export default TimelineEvent;
