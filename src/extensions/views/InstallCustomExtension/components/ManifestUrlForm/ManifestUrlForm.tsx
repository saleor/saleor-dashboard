import { messages } from "@dashboard/extensions/messages";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ClipboardEventHandler, FormEventHandler } from "react";
import { Control } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { EL_ID_MANIFEST_INPUT_LABEL, PLACEHOLDER_MANIFEST_URL } from "../../consts";
import { ExtensionInstallFormData } from "../../schema";
import { ManifestUrlFieldController } from "../ManifestUrlFieldController";

export const ManifestUrlForm = ({
  onSubmit,
  control,
  onPaste,
}: {
  onSubmit: FormEventHandler<HTMLElement>;
  control: Control<ExtensionInstallFormData>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}) => {
  return (
    <Box
      as="form"
      display="flex"
      gap={3}
      flexDirection="column"
      __width="480px"
      onSubmit={onSubmit}
    >
      <Text size={5} fontWeight="medium" id={EL_ID_MANIFEST_INPUT_LABEL}>
        <FormattedMessage {...messages.manifestUrlLabel} />
      </Text>
      <ManifestUrlFieldController
        control={control}
        name="manifestUrl"
        aria-labelledby={EL_ID_MANIFEST_INPUT_LABEL}
        placeholder={PLACEHOLDER_MANIFEST_URL}
        onPaste={onPaste}
      />
    </Box>
  );
};
