import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "../../urls";
import { InstallCustomExtensionFromForm } from "./components/InstallCustomExtensionFromForm/InstallCustomExtensionFromForm";
import { InstallCustomExtensionFromUrl } from "./components/InstallCustomExtensionFromUrl/InstallCustomExtensionFromUrl";
import { manifestFormSchema } from "./schema";
import { ExtensionInstallFormData } from "./types";

export const InstallCustomExtension = ({ params }: { params: ExtensionInstallQueryParams }) => {
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
