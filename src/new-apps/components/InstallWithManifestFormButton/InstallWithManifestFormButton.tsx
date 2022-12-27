import { TextField } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { buttonMessages } from "@saleor/intl";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

enum AvailableStates {
  Initial,
  InputOpen,
}

interface Props {
  onSubmitted(manifestUrl: string): void;
}

export const InstallWithManifestFormButton = ({ onSubmitted }: Props) => {
  const styles = useStyles();
  const intl = useIntl();

  const [state, setState] = useState<AvailableStates>(AvailableStates.Initial);

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

  switch (state) {
    case AvailableStates.Initial: {
      return (
        <Button
          variant="secondary"
          data-test-id="add-app-from-manifest"
          onClick={() => setState(AvailableStates.InputOpen)}
        >
          <FormattedMessage {...messages.installExternalApp} />
        </Button>
      );
    }
    case AvailableStates.InputOpen: {
      return (
        <form onSubmit={handleFormSubmit}>
          <TextField
            data-test-id="manifest-url-input"
            required
            type="url"
            name="manifest-url"
            label={intl.formatMessage(messages.appManifestUrl)}
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
  }
};
InstallWithManifestFormButton.displayName = "InstallWithManifestFormButton";
export default InstallWithManifestFormButton;
