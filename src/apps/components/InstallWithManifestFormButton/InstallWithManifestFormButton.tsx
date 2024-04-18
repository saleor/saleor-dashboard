import { appsMessages } from "@dashboard/apps/messages";
import { buttonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import { Box, Button } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface InstallWithManifestFormButtonProps {
  onSubmitted: (manifestUrl: string) => void;
}

export const InstallWithManifestFormButton: React.FC<InstallWithManifestFormButtonProps> = ({
  onSubmitted,
}) => {
  const styles = useStyles();
  const intl = useIntl();
  const [inputOpened, setInputOpened] = useState(false);
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const inputValue = form.get("manifest-url") as string;

    try {
      const parsedURL = new URL(inputValue);
      onSubmitted(parsedURL.href);
    } catch (e) {
      console.error("Invalid URL from input. Should be validated by browser");
    }
  };

  if (inputOpened) {
    return (
      <form onSubmit={handleFormSubmit}>
        <Box display="flex">
          <TextField
            data-test-id="manifest-url-input"
            required
            type="url"
            name="manifest-url"
            label={intl.formatMessage(appsMessages.appManifestUrl)}
            defaultValue=""
            helperText={intl.formatMessage(messages.appManifestUrlHint)}
          />
          {/* TODO: Needs to be updated after TextInput implementation */}
          <Button
            size="medium"
            type="submit"
            className={styles.installButton}
            variant="primary"
            data-test-id="install-app-from-manifest"
          >
            <FormattedMessage {...buttonMessages.install} />
          </Button>
        </Box>
      </form>
    );
  }

  return (
    <Button
      variant="primary"
      size="medium"
      data-test-id="add-app-from-manifest"
      onClick={() => setInputOpened(true)}
    >
      <FormattedMessage {...messages.installExternalApp} />
    </Button>
  );
};
InstallWithManifestFormButton.displayName = "InstallWithManifestFormButton";
export default InstallWithManifestFormButton;
