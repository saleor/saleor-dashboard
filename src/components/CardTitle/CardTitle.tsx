import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    children: theme.mixins.gutters({}),
    constantHeight: {
      height: 56
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    },
    root: theme.mixins.gutters({
      alignItems: "center",
      justifyContent: "space-between",
      display: "flex",
      minHeight: 70
    }),
    closeIcon: {
      cursor: "pointer",
      display: "flex",
      alignItems: "flex-end"
    },
    title: {
      flex: 1,
      fontWeight: 500,
      lineHeight: 1
    },
    toolbar: {
      marginRight: theme.spacing(-1)
    }
  }),
  { name: "CardTitle" }
);

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "const";
  title: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
  onClose?: () => void;
}

const CardTitle: React.FC<CardTitleProps> = props => {
  const {
    className,
    children,
    height,
    title,
    toolbar,
    onClick,
    onClose,
    ...rest
  } = props;

  const classes = useStyles(props);

  return (
    <>
      <div
        className={classNames(classes.root, {
          [className]: !!className,
          [classes.constantHeight]: height === "const"
        })}
        {...rest}
      >
        <Typography
          className={classes.title}
          variant="h5"
          onClick={onClick}
          component="span"
        >
          {title}
        </Typography>
        <div className={classes.toolbar}>{toolbar}</div>
        {onClose && (
          <div className={classes.closeIcon}>
            <CloseIcon onClick={onClose} />
          </div>
        )}
      </div>
      <div className={classes.children}>{children}</div>
      <hr className={classes.hr} />
    </>
  );
};
CardTitle.displayName = "CardTitle";
export default CardTitle;
