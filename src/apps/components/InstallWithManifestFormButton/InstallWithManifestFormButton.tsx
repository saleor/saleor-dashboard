import { TextField } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

type AvailableStates = "initial" | "input-open";

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

  const [state, setState] = useState<AvailableStates>("initial");

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
    case "initial": {
      return (
        <Button
          variant="secondary"
          data-test-id="add-app-from-manifest"
          onClick={() => setState("input-open")}
        >
          <FormattedMessage
            id="kIXV5V"
            defaultMessage="Install with App Manifest"
            description="install with app manifest button"
          />
        </Button>
      );
    }
    case "input-open": {
      return (
        <form onSubmit={handleFormSubmit}>
          <TextField
            type="url"
            name="manifest-url"
            label="App manifest url"
            defaultValue=""
            helperText="Usually ends with /api/manifest"
          />
          <Button
            size="medium"
            type="submit"
            className={styles.installButton}
            variant="primary"
          >
            Install
          </Button>
        </form>
      );
    }
  }
};
