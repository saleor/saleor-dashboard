import Skeleton from "@dashboard/components/Skeleton";
import { AppQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { ButtonBase } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import deleteIcon from "../../../../assets/images/delete.svg";
import { useStyles } from "./styles";

interface HeaderOptionsProps {
  data: AppQuery["app"];
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({
  data,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
  const classes = useStyles();

  if (!data) {
    return (
      <Box marginX={7}>
        <Skeleton />
        <div className={classes.hr} />
      </Box>
    );
  }

  return (
    <Box marginX={7}>
      <div className={classes.appHeaderLinks}>
        <ButtonBase
          className={classes.headerLinkContainer}
          disableRipple
          onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
        >
          <SVG src={activateIcon} />
          {data?.isActive ? (
            <FormattedMessage {...buttonMessages.deactivate} />
          ) : (
            <FormattedMessage {...buttonMessages.activate} />
          )}
        </ButtonBase>
        <ButtonBase
          className={classes.headerLinkContainer}
          disableRipple
          onClick={onAppDeleteOpen}
        >
          <SVG src={deleteIcon} />
          <FormattedMessage {...buttonMessages.delete} />
        </ButtonBase>
      </div>
      <div className={classes.hr} />
    </Box>
  );
};
export default HeaderOptions;
