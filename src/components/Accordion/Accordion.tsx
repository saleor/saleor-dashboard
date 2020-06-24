import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import React from "react";

import Hr from "../Hr";

const useStyles = makeStyles(
  theme => ({
    content: {
      padding: theme.spacing(3, 0)
    },
    expandButton: {
      position: "relative",
      right: theme.spacing(-2),
      top: theme.spacing(0.5)
    },
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 12,
      padding: theme.spacing(0, 3)
    },
    title: {
      display: "flex",
      justifyContent: "space-between"
    },
    titleText: {
      padding: theme.spacing(2, 0)
    }
  }),
  {
    name: "Accordion"
  }
);

export interface AccordionProps {
  initialExpand?: boolean;
  title: string;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  initialExpand,
  title
}) => {
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(!!initialExpand);

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography className={classes.titleText}>{title}</Typography>
        <div className={classes.expandButton}>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </div>
      </div>
      {expanded && (
        <>
          <Hr />
          <div className={classes.content}>{children}</div>
        </>
      )}
    </div>
  );
};

Accordion.displayName = "Accordion";
export default Accordion;
