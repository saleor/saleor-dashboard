import FullScreenIcon from "@dashboard/icons/FullScreenIcon";
import { Button, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { ReactNode } from "react";

interface HeaderButtonFullScreenProps {
  isOpen: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const useStyles = makeStyles(
  theme => ({
    headerBtn: {
      marginBottom: theme.spacing(2),
    },

    fullScreenIcon: {
      fontSize: theme.typography.body1.fontSize,
    },
    fullScreenIconClose: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "DatagridButtonFullScreen" },
);

export const HeaderButtonFullScreen = ({
  isOpen,
  onToggle,
  children,
}: HeaderButtonFullScreenProps) => {
  const classes = useStyles();

  return (
    <Button
      data-test-id="button-exit-fullscreen"
      className={classes.headerBtn}
      variant="tertiary"
      onClick={onToggle}
    >
      <FullScreenIcon
        className={clsx(classes.fullScreenIcon, {
          [classes.fullScreenIconClose]: isOpen,
        })}
      />
      {children}
    </Button>
  );
};
