import { TopNav } from "@dashboard/components/AppLayout";
import { HookFormInput } from "@dashboard/components/HookFormInput";
import { Savebar } from "@dashboard/components/Savebar";
import { useAppFetchMutation, useAppInstallMutation } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { extractMutationErrors } from "@dashboard/misc";
import getAppErrorMessage, { appErrorMessages } from "@dashboard/utils/errors/app";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { z } from "zod";

import { ExternalLinkUnstyled } from "../../components/ExternalLinkUnstyled";
import { headerTitles, messages } from "../../messages";
import { ExtensionInstallQueryParams, ExtensionsPaths, MANIFEST_ATTR } from "../../urls";
import { InstallSectionData } from "./components/InstallSectionData";
import { FormData } from "./types";

const PLACEHOLDER_MANIFEST_URL = "https://example.com/api/manifest";

const EL_ID_MANIFEST_INPUT_LABEL = "manifest-input-label";

const previousPagePath = ExtensionsPaths.installedExtensions;

const schema = z.object({
  manifestUrl: z.string().url().trim(),
});

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const manifestUrlFromQueryParams = params[MANIFEST_ATTR];

  const { control, trigger, watch, handleSubmit, setError, getValues } = useForm<FormData>({
    values: {
      manifestUrl: manifestUrlFromQueryParams || "",
    },
    // resolver: zodResolver(schema),
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

  const submitFetchManifest: SubmitHandler<FormData> = data => {
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

  useEffect(() => {
    if (manifestUrlFromQueryParams) {
      (async () => {
        await trigger();
        await handleSubmit(submitFetchManifest)();
      })();
    }
    // Run this only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Box
          as="form"
          display="flex"
          gap={3}
          flexDirection="column"
          __width="380px"
          onSubmit={handleSubmit(submitFetchManifest)}
        >
          <Text size={5} fontWeight="medium" id={EL_ID_MANIFEST_INPUT_LABEL}>
            Provide Manifest URL
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
            onPaste={() => {
              // On paste immediately submit form
              // Wait for next tick when debounced submit is scheduled and call it immedioately
              setTimeout(() => {
                flushDebouncedSubmit();
              });
            }}
          />
        </Box>
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
