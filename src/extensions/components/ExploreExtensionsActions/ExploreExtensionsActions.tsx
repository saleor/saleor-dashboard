import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { buttonLabels } from "@dashboard/extensions/messages";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const ExploreExtensionsActions = () => {
  const intl = useIntl();

  return (
    <>
      <Button variant="secondary" size="large">
        <FormattedMessage {...buttonLabels.requestExtension} />
      </Button>
      <ButtonWithDropdown
        size="large"
        options={[
          {
            label: intl.formatMessage(buttonLabels.installFromManifest),
            testId: "install-from-manifest",
            onSelect: () => {
              // TODO: Implement click logic
              // eslint-disable-next-line no-console
              console.log("Navigate to install page");
            },
          },
          {
            label: intl.formatMessage(buttonLabels.installManually),
            testId: "install-manually",
            onSelect: () => {
              // TODO: Implement click logic
              // eslint-disable-next-line no-console
              console.log("Navigate to install page");
            },
          },
        ]}
      >
        <FormattedMessage {...buttonLabels.addCustomExtensions} />
      </ButtonWithDropdown>
    </>
  );
};
