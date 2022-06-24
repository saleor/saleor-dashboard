import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList as Menu,
  Paper,
  Popper,
} from "@material-ui/core";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

interface ProductMediaPopperProps {
  anchorRef: HTMLButtonElement;
  imagesUploadRef: HTMLInputElement;
  openMediaUrlModal: () => void;
  popperStatus: boolean;
  setPopperStatus: (popperStatus: boolean) => void;
}

const messages = defineMessages({
  uploadImages: {
    id: "9CEu8k",
    defaultMessage: "Upload Images",
    description: "modal button images upload",
  },
  uploadUrl: {
    id: "Q2UXlW",
    defaultMessage: "Upload URL",
    description: "modal button url upload",
  },
});

export const ProductMediaPopper = ({
  anchorRef,
  imagesUploadRef,
  setPopperStatus,
  openMediaUrlModal,
  popperStatus,
}: ProductMediaPopperProps) => {
  const intl = useIntl();

  return (
    <Popper
      open={popperStatus}
      anchorEl={anchorRef}
      transition
      placement="bottom-end"
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <Paper>
            <ClickAwayListener
              onClickAway={() => setPopperStatus(false)}
              mouseEvent="onClick"
            >
              <Menu>
                <MenuItem
                  onClick={() => imagesUploadRef.click()}
                  data-test-id="upload-images"
                  key="upload-images"
                >
                  {intl.formatMessage(messages.uploadImages)}
                </MenuItem>
                <MenuItem
                  onClick={openMediaUrlModal}
                  data-test-id="upload-media-url"
                  key="upload-media-url"
                >
                  {intl.formatMessage(messages.uploadUrl)}
                </MenuItem>
              </Menu>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
