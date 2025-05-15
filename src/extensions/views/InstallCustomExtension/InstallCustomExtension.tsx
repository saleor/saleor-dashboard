import { TopNav } from "@dashboard/components/AppLayout";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ExternalLinkUnstyled } from "../../components/ExternalLinkUnstyled";
import { headerTitles, messages } from "../../messages";
import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "../../urls";
import { InstallCustomExtensionFromForm } from "./components/InstallCustomExtensionFromForm/InstallCustomExtensionFromForm";
import { InstallCustomExtensionFromUrl } from "./components/InstallCustomExtensionFromUrl/InstallCustomExtensionFromUrl";
import { previousPagePath } from "./consts";
import { manifestFormSchema } from "./schema";
import { ExtensionInstallFormData } from "./types";

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
  const intl = useIntl();

  const manifestUrlFromQueryParams = params[MANIFEST_ATTR];

  const { control, trigger, watch, handleSubmit, setError, getValues } =
    useForm<ExtensionInstallFormData>({
      resolver: zodResolver(manifestFormSchema),
      values: {
        manifestUrl: manifestUrlFromQueryParams || "",
      },
      mode: "onBlur",
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
      {manifestUrlFromQueryParams ? (
        <InstallCustomExtensionFromUrl
          control={control}
          trigger={trigger}
          handleSubmit={handleSubmit}
          setError={setError}
          getValues={getValues}
          params={params}
        />
      ) : (
        <InstallCustomExtensionFromForm
          control={control}
          handleSubmit={handleSubmit}
          getValues={getValues}
          setError={setError}
          watch={watch}
        />
      )}
    </>
  );
};
