import { TopNav } from "@dashboard/components/AppLayout";
import { Savebar } from "@dashboard/components/Savebar";
import { useAppFetchMutation, useAppInstallMutation } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { extractMutationErrors } from "@dashboard/misc";
import getAppErrorMessage, { appErrorMessages } from "@dashboard/utils/errors/app";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ExternalLinkUnstyled } from "../../components/ExternalLinkUnstyled";
import { headerTitles, messages } from "../../messages";
import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "../../urls";
import { InstallSectionData } from "./components/InstallSectionData";
import { ManifestUrlForm } from "./components/ManifestUrlForm/ManifestUrlForm";
import { previousPagePath } from "./consts";
import { useLoadQueryParamsToForm } from "./hooks/useLoadQueryParamsToForm";
import { ExtensionInstallFormData } from "./types";

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const manifestUrlFromQueryParams = params[MANIFEST_ATTR];

  const { control, trigger, watch, handleSubmit, setError, getValues } =
    useForm<ExtensionInstallFormData>({
      values: {
        manifestUrl: manifestUrlFromQueryParams || "",
      },
      mode: "onBlur",
    });

  const validateUrl = useCallback(
    (value: any) => {
      if (typeof value === "string") {
        try {
          new URL(value);

          return true;
        } catch (e) {
          // no-op
        }
      }

      return intl.formatMessage(appErrorMessages.invalidUrlFormat);
    },
    [intl],
  );

  const [, setActiveInstallations] = useLocalStorage<Array<Record<"id" | "name", string>>>(
    "activeInstallations",
    [],
  );

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

  const [installApp, installAppOpts] = useAppInstallMutation({
    onCompleted: data => {
      const installationData = data?.appInstall?.appInstallation;

      if (data.appInstall?.errors.length === 0) {
        if (installationData) {
          setActiveInstallations(activeInstallations => [
            ...activeInstallations,
            {
              id: installationData.id,
              name: installationData.appName,
            },
          ]);
        }

        navigate(previousPagePath);
      } else {
        (data?.appInstall?.errors ?? []).forEach(error => {
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          });
        });
      }
    },
  });

  const submitFetchManifest: SubmitHandler<ExtensionInstallFormData> = data => {
    fetchManifest({ variables: data });
  };

  const submitInstallApp = async () => {
    const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

    const errors = await extractMutationErrors(
      installApp({
        variables: {
          input: {
            appName: manifest?.name,
            manifestUrl: getValues("manifestUrl"),
            permissions: manifest?.permissions?.map(permission => permission.code),
          },
        },
      }),
    );

    if (!errors) {
      navigate(previousPagePath);
    }
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

  const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

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
          transitionState={installAppOpts.loading ? "loading" : "default"}
          onClick={() => submitInstallApp()}
        >
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </>
  );
};
