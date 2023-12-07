import { buttonMessages } from "@dashboard/intl";
import { ButtonBase } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import deleteIcon from "../../../../assets/images/delete.svg";
import { useStyles } from "./styles";

interface HeaderOptionsProps {
  isActive: boolean;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({
  isActive,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
  const classes = useStyles();

  return (
    <Box
      paddingX={6}
      borderBottomStyle="solid"
      borderColor="default1"
      borderBottomWidth={1}
    >
      <div className={classes.appHeaderLinks}>
        <ButtonBase
          className={classes.headerLinkContainer}
          disableRipple
          onClick={isActive ? onAppDeactivateOpen : onAppActivateOpen}
        >
          <SVG src={activateIcon} />
          {isActive ? (
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
    </Box>
  );
};
export default HeaderOptions;
