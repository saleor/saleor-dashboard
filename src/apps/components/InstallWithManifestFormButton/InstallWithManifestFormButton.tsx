import { TextField } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

enum AvailableStates {
  Initial,
  InputOpen,
}

const useStyles = makeStyles(
  theme => ({
    installButton: {
      marginLeft: theme.spacing(2),
      height: 52,
    },
  }),
  {
    name: "InstallWithManifestFormButton",
  },
);

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
          <FormattedMessage
            id="kIXV5V"
            defaultMessage="Install with App Manifest"
            description="install with app manifest button"
          />
        </Button>
      );
    }
    case AvailableStates.InputOpen: {
      return (
        <form onSubmit={handleFormSubmit}>
          <TextField
            required
            type="url"
            name="manifest-url"
            label={intl.formatMessage({
              id: "QVraQY",
              defaultMessage: "App manifest URL",
            })}
            defaultValue=""
            helperText={intl.formatMessage({
              id: "o/q4fc",
              defaultMessage: "Usually ends with /api/manifest",
            })}
          />
          <Button
            size="medium"
            type="submit"
            className={styles.installButton}
            variant="primary"
          >
            {intl.formatMessage({
              id: "ubmFc8",
              defaultMessage: "Install",
            })}
          </Button>
        </form>
      );
    }
  }
};
