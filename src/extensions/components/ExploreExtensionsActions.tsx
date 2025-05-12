import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import Link from "@dashboard/components/Link";
import { buttonLabels } from "@dashboard/extensions/messages";
import useNavigator from "@dashboard/hooks/useNavigator";
import { MISSING_APPS_TYPEFORM_URL } from "@dashboard/links";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ExtensionsUrls } from "../urls";

export const ExploreExtensionsActions = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <>
      <Link href={MISSING_APPS_TYPEFORM_URL} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="large">
          <FormattedMessage {...buttonLabels.requestExtension} />
        </Button>
      </Link>
      <ButtonWithDropdown
        size="large"
        options={[
          {
            label: intl.formatMessage(buttonLabels.installFromManifest),
            testId: "install-from-manifest",
            onSelect: () => {
              navigate(ExtensionsUrls.installCustomExtensionUrl());
            },
          },
          {
            label: intl.formatMessage(buttonLabels.installManually),
            testId: "install-manually",
            onSelect: () => {
              navigate(ExtensionsUrls.addCustomExtensionUrl());
            },
          },
        ]}
      >
        <FormattedMessage {...buttonLabels.addCustomExtensions} />
      </ButtonWithDropdown>
    </>
  );
};
