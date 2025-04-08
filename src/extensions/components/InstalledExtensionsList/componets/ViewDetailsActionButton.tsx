import { AppPaths } from "@dashboard/apps/urls";
import Link from "@dashboard/components/Link";
import { buttonLabels } from "@dashboard/extensions/messages";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ViewDetailsActionButtonProps {
  isDisabled?: boolean;
  id?: string;
}

export const ViewDetailsActionButton = ({ isDisabled, id }: ViewDetailsActionButtonProps) => {
  // When no id means that apps installation is in progress
  if (!id) {
    return (
      <Button size="small" disabled={true} variant="secondary">
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    );
  }

  if (isDisabled) {
    return (
      <Link href={AppPaths.resolveAppPath(id)}>
        <Button size="small" variant="secondary">
          <FormattedMessage {...buttonLabels.manage} />
        </Button>
      </Link>
    );
  }

  return (
    <Link href={AppPaths.resolveAppDetailsPath(id)}>
      <Button size="small" variant="secondary">
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    </Link>
  );
};
