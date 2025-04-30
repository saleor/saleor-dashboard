import { AppPaths, AppUrls } from "@dashboard/apps/urls";
import Link from "@dashboard/components/Link";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppTypeEnum } from "@dashboard/graphql";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ViewDetailsActionButtonProps {
  isDisabled?: boolean;
  id?: string;
  name: string | null;
  type: AppTypeEnum | null;
}

export const ViewDetailsActionButton = ({
  name,
  type,
  isDisabled,
  id,
}: ViewDetailsActionButtonProps) => {
  // When no id means that apps installation is in progress
  const formattedName = name?.toLowerCase().replace(" ", "") ?? "";

  if (!id) {
    return (
      <Button
        size="small"
        disabled={true}
        variant="secondary"
        data-test-id={`${formattedName}-view-details`}
      >
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    );
  }

  if (isDisabled) {
    return (
      <Link href={AppPaths.resolveAppDetailsPath(id)}>
        <Button size="small" variant="secondary">
          <FormattedMessage {...buttonLabels.manage} />
        </Button>
      </Link>
    );
  }

  return (
    <Link
      href={
        type === AppTypeEnum.LOCAL
          ? ExtensionsUrls.editCustomExtensionUrl(id)
          : AppUrls.resolveAppUrl(id)
      }
      data-test-id={`${formattedName}-view-details`}
    >
      <Button size="small" variant="secondary">
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    </Link>
  );
};
