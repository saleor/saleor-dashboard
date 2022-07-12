import closeIcon from "@assets/images/close-thin.svg";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";

import FormSpacer from "../FormSpacer";

const CLOSE_ICON_SIZE = 14;

const useStyles = makeStyles(
  theme => ({
    buttonText: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: 14,
      margin: theme.spacing(1, 0),
      paddingBottom: 10,
      paddingTop: 0,
    },
    container: {
      alignItems: "baseline",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    icon: {
      cursor: "pointer",
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "DateVisibilitySelector" },
);

interface Props {
  buttonText: string;
  children: React.ReactNode;
  onInputClose: () => void;
}

const DateVisibilitySelector = ({
  buttonText,
  children,
  onInputClose,
}: Props) => {
  const classes = useStyles({});

  const [showInput, setShowInput] = useState<boolean>(false);

  const handleCloseIconClick = () => {
    setShowInput(false);
    onInputClose();
  };

  if (!showInput) {
    return (
      <Typography
        className={classes.buttonText}
        onClick={() => setShowInput(true)}
      >
        {buttonText}
      </Typography>
    );
  }

  return (
    <>
      <div className={classes.container}>
        {children}
        <div className={classes.icon} onClick={handleCloseIconClick}>
          <img
            src={closeIcon}
            alt="close icon"
            width={CLOSE_ICON_SIZE}
            height={CLOSE_ICON_SIZE}
          />
        </div>
      </div>
      <FormSpacer />
    </>
  );
};

export default DateVisibilitySelector;
