import { TopNav } from "@dashboard/components/AppLayout";
import { Savebar } from "@dashboard/components/Savebar";
import { useAppFetchMutation } from "@dashboard/graphql";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ExternalLinkUnstyled } from "../../components/ExternalLinkUnstyled";
import { headerTitles, messages } from "../../messages";
import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "../../urls";
import { InstallSectionData } from "./components/InstallSectionData";
import { ManifestUrlForm } from "./components/ManifestUrlForm/ManifestUrlForm";
import { previousPagePath } from "./consts";
import { useInstallApp } from "./hooks/useInstallApp";
import { useLoadQueryParamsToForm } from "./hooks/useLoadQueryParamsToForm";
import { ExtensionInstallFormData } from "./types";

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();

  const manifestUrlFromQueryParams = params[MANIFEST_ATTR];

  const { control, trigger, watch, handleSubmit, setError, getValues } =
    useForm<ExtensionInstallFormData>({
      values: {
        manifestUrl: manifestUrlFromQueryParams || "",
      },
      mode: "onBlur",
    });

  // TODO: Remove this once updated to newer Apollo version
  // In latest apollo we can call fetchManifestOpts.reset to clear data
  const [lastFetchedManifestUrl, setLastFetchedManifestUrl] = useState<string>();

  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      setLastFetchedManifestUrl(getValues("manifestUrl"));

      if (data?.appFetchManifest?.errors.length) {
        const mergedErrorMessages = data.appFetchManifest.errors
          .map(error => getAppErrorMessage(error, intl))
          .join(", ");

        setError("manifestUrl", {
          message: mergedErrorMessages,
          type: "validate",
        });
      }
    },
  });

  const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

  const { submitInstallApp, isSubmittingInstallation } = useInstallApp({
    getValues,
    manifest,
  });
  const submitFetchManifest: SubmitHandler<ExtensionInstallFormData> = data => {
    fetchManifest({ variables: data });
  };

  const { flush: flushDebouncedSubmit } = useAutoSubmit({
    trigger,
    watch,
    onSubmit: handleSubmit(submitFetchManifest),
    control,
  });

  useLoadQueryParamsToForm({
    trigger,
    onSubmit: handleSubmit(submitFetchManifest),
    params,
  });

  return (
    <>
      <TopNav
        href={previousPagePath}
        __height="auto"
        title={intl.formatMessage(headerTitles.addCustomExtensionManifest)}
        subtitle={
          <FormattedMessage
            {...messages.learnMoreSubheader}
            values={{
              manifestFormatLink: (
                <ExternalLinkUnstyled href={MANIFEST_FORMAT_DOCS_URL} target="_blank">
                  <FormattedMessage {...messages.manifestFormatLink} />
                </ExternalLinkUnstyled>
              ),
            }}
          />
        }
      ></TopNav>
      <Box marginX={6} marginTop={10} display="flex" flexDirection="column" gap={10}>
        <ManifestUrlForm
          control={control}
          onSubmit={handleSubmit(submitFetchManifest)}
          onPaste={() => {
            // On paste immediately submit form
            // Wait for next tick when debounced submit is scheduled and call it immedioately
            setTimeout(() => {
              flushDebouncedSubmit();
            });
          }}
        />
        <InstallSectionData
          isManifestLoading={fetchManifestOpts.loading}
          manifest={manifest}
          lastFetchedManifestUrl={lastFetchedManifestUrl}
          control={control}
        />
      </Box>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton href={previousPagePath} />
        <Savebar.ConfirmButton
          disabled={!manifest}
          transitionState={isSubmittingInstallation ? "loading" : "default"}
          onClick={() => submitInstallApp()}
        >
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </>
  );
};
