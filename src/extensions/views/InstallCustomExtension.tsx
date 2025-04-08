import { TopNav } from "@dashboard/components/AppLayout";
import { HookFormInput } from "@dashboard/components/HookFormInput";
import { InputWithPlaceholder } from "@dashboard/components/InputWithPlaceholder/InputWithPlaceholder";
import { Savebar } from "@dashboard/components/Savebar";
import {
  AppFetchMutationVariables,
  useAppFetchMutation,
  useAppInstallMutation,
} from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import ErrorExclamationCircle from "@dashboard/icons/ErrorExclamationCircle";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { extractMutationErrors } from "@dashboard/misc";
import getAppErrorMessage, { appErrorMessages } from "@dashboard/utils/errors/app";
import { useAutoSubmit } from "@dashboard/utils/hook-form/auto-submit";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { headerTitles, messages } from "../messages";
import { ExtensionInstallQueryParams, ExtensionsPaths, MANIFEST_ATTR } from "../urls";

const PLACEHOLDER_MANIFEST_URL = "https://example.com/api/manifest";

const EL_ID_MANIFEST_INPUT_LABEL = "manifest-input-label";

type FormData = AppFetchMutationVariables;

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { control, trigger, watch, handleSubmit } = useForm<FormData>({
    values: {
      manifestUrl: params[MANIFEST_ATTR] || "",
    },
  });

  const validateUrl = useCallback(
    (value: any) => {
      if (typeof value === "string") {
        try {
          new URL(value);
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
  const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
    onCompleted: data => {
      if (data?.appFetchManifest?.errors.length) {
        data.appFetchManifest.errors.forEach(error => {
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          });
        });
      }
    },
  });

  const [installApp] = useAppInstallMutation({
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

        navigate(ExtensionsPaths.installedExtensions);
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

  const submitInstallApp: SubmitHandler<FormData> = data => {
    const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

    return extractMutationErrors(
      installApp({
        variables: {
          input: {
            appName: manifest?.name,
            manifestUrl: data.manifestUrl,
            permissions: manifest?.permissions?.map(permission => permission.code),
          },
        },
      }),
    );
  };

  useAutoSubmit({
    trigger,
    watch,
    onSubmit: handleSubmit(submitFetchManifest),
  });

  return (
    <>
      <TopNav
        // TODO: replace url with previous page?
        href={ExtensionsPaths.installedExtensions}
        __height="auto"
        title={intl.formatMessage(headerTitles.addCustomExtensionManifest)}
        subtitle={
          <FormattedMessage
            {...messages.learnMoreSubheader}
            values={{
              manifestFormatLink: (
                <Box
                  as="a"
                  href={MANIFEST_FORMAT_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  borderBottomStyle="solid"
                  borderWidth={1}
                >
                  <FormattedMessage {...messages.manifestFormatLink} />
                </Box>
              ),
            }}
          />
        }
      ></TopNav>
      <Box
        as="form"
        marginX={6}
        marginTop={10}
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
          // TODO: intl
          rules={{ required: "Required", validate: validateUrl }}
          aria-labelledby={EL_ID_MANIFEST_INPUT_LABEL}
          placeholder={PLACEHOLDER_MANIFEST_URL}
        />
      </Box>
      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton />
        <Savebar.ConfirmButton>
          <FormattedMessage {...messages.install} />
        </Savebar.ConfirmButton>
      </Savebar>
    </>
  );
};
