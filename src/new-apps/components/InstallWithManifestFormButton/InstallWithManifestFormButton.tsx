import { TextField } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { buttonMessages } from "@saleor/intl";
import { appsMessages } from "@saleor/new-apps/messages";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface Props {
  onSubmitted(manifestUrl: string): void;
}

export const InstallWithManifestFormButton: React.FC<Props> = ({
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
      new URL(inputValue);

      onSubmitted(inputValue);
    } catch (e) {
      console.error("Invalid URL from input. Should be validated by browser");
    }
  };

  if (inputOpened) {
    return (
      <form onSubmit={handleFormSubmit}>
        <TextField
          data-test-id="manifest-url-input"
          required
          type="url"
          name="manifest-url"
          label={intl.formatMessage(appsMessages.appManifestUrl)}
          defaultValue=""
          helperText={intl.formatMessage(messages.appManifestUrlHint)}
        />
        <Button
          size="medium"
          type="submit"
          className={styles.installButton}
          variant="primary"
          data-test-id="install-app-from-manifest"
        >
          <FormattedMessage {...buttonMessages.install} />
        </Button>
      </form>
    );
  }

  return (
    <Button
      variant="secondary"
      data-test-id="add-app-from-manifest"
      onClick={() => setInputOpened(true)}
    >
      <FormattedMessage {...messages.installExternalApp} />
    </Button>
  );
};
InstallWithManifestFormButton.displayName = "InstallWithManifestFormButton";
export default InstallWithManifestFormButton;
