import { TopNav } from "@dashboard/components/AppLayout";
import { Savebar } from "@dashboard/components/Savebar";
import useDebounce from "@dashboard/hooks/useDebounce";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ExternalLinkUnstyled } from "../../components/ExternalLinkUnstyled";
import { headerTitles, messages } from "../../messages";
import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "../../urls";
import { InstallSectionData } from "./components/InstallSectionData";
import { ManifestUrlForm } from "./components/ManifestUrlForm/ManifestUrlForm";
import { previousPagePath } from "./consts";
import { useFetchManifest } from "./hooks/useFetchManifest";
import { useInstallApp } from "./hooks/useInstallApp";
import { useLoadQueryParamsToForm } from "./hooks/useLoadQueryParamsToForm";
import { ExtensionInstallFormData } from "./types";

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();

  const manifestUrlFromQueryParams = params[MANIFEST_ATTR];

  const { control, trigger, handleSubmit, setError, getValues } = useForm<ExtensionInstallFormData>(
    {
      values: {
        manifestUrl: manifestUrlFromQueryParams || "",
      },
      mode: "onBlur",
    },
  );

  const { submitFetchManifest, manifest, lastFetchedManifestUrl, isFetchingManifest } =
    useFetchManifest({
      getValues,
      setError,
    });

  const { submitInstallApp, isSubmittingInstallation } = useInstallApp({
    getValues,
    manifest,
  });

  const [submitImmediately, setSubmitImmediately] = useState(false);

  const debouncedSubmit = useDebounce(
    handleSubmit(submitFetchManifest),
    submitImmediately ? 0 : 1000,
  );

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
          onChange={() => {
            setSubmitImmediately(false);
            debouncedSubmit();
          }}
          onPaste={() => {
            setSubmitImmediately(true);
            debouncedSubmit();
          }}
          control={control}
          onSubmit={handleSubmit(submitFetchManifest)}
        />
        <InstallSectionData
          isFetchingManifest={isFetchingManifest}
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
