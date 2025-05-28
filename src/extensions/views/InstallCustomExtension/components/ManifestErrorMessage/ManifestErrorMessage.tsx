import {
  appManifestErrorMessages,
  messages as extensionMessages,
} from "@dashboard/extensions/messages";
import { getAppErrorMessageDescriptor } from "@dashboard/extensions/utils";
import { AppErrorCode } from "@dashboard/graphql";
import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import { commonMessages } from "@dashboard/intl";
import { getSpecificManifestErrorDocLink } from "@dashboard/links";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Box, BoxProps, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FieldError } from "react-hook-form";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import {
  MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT,
  MANIFEST_URL_CLIENT_VALIDATION_REQUIRED,
} from "../../schema";

const getFieldErrorMessage = (error: FieldError, intl: IntlShape): string | React.ReactNode => {
  const backendErrorCode = error.type as AppErrorCode;
  const clientErrorCode = error.message;

  if (clientErrorCode === MANIFEST_URL_CLIENT_VALIDATION_REQUIRED) {
    return intl.formatMessage(commonMessages.requiredField);
  }

  if (clientErrorCode === MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT) {
    return intl.formatMessage(appManifestErrorMessages.invalidUrlFormatSimple);
  }

  if (backendErrorCode) {
    const messageDescriptor = getAppErrorMessageDescriptor(backendErrorCode);
    const learnMoreLink = getSpecificManifestErrorDocLink(backendErrorCode);

    if (learnMoreLink) {
      const learnMoreLinkComponent = (
        <Text
          as="a"
          href={learnMoreLink}
          target="_blank"
          rel="noopener noreferrer"
          color="default2"
          textDecoration="underline"
          size={2}
          display="inline-block"
        >
          <FormattedMessage {...extensionMessages.learnMoreError} />
        </Text>
      );

      return intl.formatMessage(messageDescriptor, {
        errorCode: backendErrorCode,
        docsLink: learnMoreLinkComponent,
      });
    }

    return intl.formatMessage(messageDescriptor, { errorCode: backendErrorCode });
  }

  return error.message || intl.formatMessage(commonErrorMessages.unknownError);
};

export const ManifestErrorMessage = ({
  error,
  className,
  ...props
}: {
  error: FieldError | null | undefined;
} & BoxProps) => {
  const intl = useIntl();

  if (!error) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      aria-live="polite"
      className={className}
      {...props}
    >
      <Box display="flex" alignItems="flex-start" gap={2} color="default2">
        <ErrorCircle __width="16px" __height="16px" flexShrink="0" color="critical1" />
        <Box>
          <Text size={2} color="default2" display="inline-block">
            {getFieldErrorMessage(error, intl)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
