import { Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { IconButton, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import Hr from "../Hr";

const useStyles = makeStyles(
  theme => ({
    content: {
      padding: theme.spacing(3, 0),
    },
    expandButton: {
      position: "relative",
      right: theme.spacing(-2),
      top: theme.spacing(0.5),
    },
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 12,
      padding: theme.spacing(0, 3),
    },
    title: {
      display: "flex",
      justifyContent: "space-between",
    },
    titleText: {
      padding: theme.spacing(2, 0),
    },
  }),
  {
    name: "Accordion",
  },
);

export interface AccordionProps {
  className?: string;
  initialExpand?: boolean;
  quickPeek?: React.ReactNode;
  title: string;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  initialExpand,
  quickPeek,
  title,
  ...props
}) => {
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(!!initialExpand);

  return (
    <div className={classNames(classes.root, className)} {...props}>
      <div className={classes.title}>
        <Typography className={classes.titleText}>{title}</Typography>
        <div className={classes.expandButton}>
          <IconButton
            variant="secondary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </div>
      </div>
      {(expanded || !!quickPeek) && (
        <>
          <Hr />
          <div className={classes.content}>
            {quickPeek ? (expanded ? children : quickPeek) : children}
          </div>
        </>
      )}
    </div>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;
