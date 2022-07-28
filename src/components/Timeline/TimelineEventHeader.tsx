import { Typography } from "@material-ui/core";
import useNavigator from "@saleor/hooks/useNavigator";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { DateTime } from "../Date";
import Link from "../Link";

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    date: {
      color: theme.typography.caption.color,
      paddingLeft: 24,
    },
    elementsContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    secondaryTitle: {
      color: "#9e9e9e",
      fontSize: 14,
      marginTop: theme.spacing(2),
    },
    titleElement: {
      marginRight: theme.spacing(0.5),
    },
  }),
  { name: "TimelineEventHeader" },
);

export interface TitleElement {
  text: string;
  link?: string;
}

export interface TimelineEventHeaderProps {
  title?: React.ReactNode;
  date: string;
  titleElements?: TitleElement[];
  secondaryTitle?: string;
}

export const TimelineEventHeader: React.FC<TimelineEventHeaderProps> = props => {
  const { title, date, titleElements, secondaryTitle } = props;
  const navigate = useNavigator();

  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      {title && <Typography>{title}</Typography>}
      {titleElements && (
        <div className={classes.elementsContainer}>
          {titleElements.filter(Boolean).map(({ text, link }) => {
            if (link) {
              return (
                <Link
                  className={classes.titleElement}
                  onClick={() => navigate(link)}
                >
                  {text}
                </Link>
              );
            }

            return (
              <Typography className={classes.titleElement}>{text}</Typography>
            );
          })}
        </div>
      )}
      <Typography className={classes.date}>
        <DateTime date={date} />
      </Typography>
      {secondaryTitle && (
        <Typography className={classes.secondaryTitle}>
          {secondaryTitle}
        </Typography>
      )}
    </div>
  );
};

export default TimelineEventHeader;
