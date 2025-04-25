import { HookFormInput } from "@dashboard/components/HookFormInput";
import { messages } from "@dashboard/extensions/messages";
import { commonMessages } from "@dashboard/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ClipboardEventHandler, FormEventHandler } from "react";
import { Control } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { EL_ID_MANIFEST_INPUT_LABEL, PLACEHOLDER_MANIFEST_URL } from "../../consts";
import { useValidateUrl } from "../../hooks/useValidateUrl";
import { ExtensionInstallFormData } from "../../types";

export const ManifestUrlForm = ({
  onSubmit,
  control,
  onPaste,
}: {
  onSubmit: FormEventHandler<HTMLElement>;
  control: Control<ExtensionInstallFormData>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}) => {
  const intl = useIntl();

  const validateUrl = useValidateUrl();

  return (
    <Box
      as="form"
      display="flex"
      gap={3}
      flexDirection="column"
      __width="380px"
      onSubmit={onSubmit}
    >
      <Text size={5} fontWeight="medium" id={EL_ID_MANIFEST_INPUT_LABEL}>
        <FormattedMessage {...messages.manifestUrlLabel} />
      </Text>
      <HookFormInput
        control={control}
        name="manifestUrl"
        rules={{
          required: intl.formatMessage(commonMessages.requiredField),
          validate: validateUrl,
        }}
        aria-labelledby={EL_ID_MANIFEST_INPUT_LABEL}
        placeholder={PLACEHOLDER_MANIFEST_URL}
        onPaste={onPaste}
      />
    </Box>
  );
};
