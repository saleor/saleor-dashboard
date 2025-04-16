import { TopNav } from "@dashboard/components/AppLayout";
import { HookFormCheckbox } from "@dashboard/components/HookFormCheckbox";
import { HookFormInput } from "@dashboard/components/HookFormInput";
import { Savebar } from "@dashboard/components/Savebar";
import { ExternalLinkUnstyled } from "@dashboard/extensions/components/ExternalLinkUnstyled";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { PermissionEnum } from "@dashboard/graphql/types.generated";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { CUSTOM_EXTENSIONS_DOCS_URL } from "@dashboard/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { z } from "zod";

import { formLabels, headerTitles, infoMessages, messages } from "../../messages";

const formSchema = z.object({
  appName: z.string().min(1, { message: "App name is required" }),
  fullAccess: z.boolean(),
  permissions: z.record(z.boolean()),
});

export type CustomExtensionFormData = z.infer<typeof formSchema>;

export function AddCustomExtension() {
  const intl = useIntl();
  const navigate = useNavigator();
  const shop = useShop();
  const permissions = shop?.permissions ?? [];

  // Initialize permissions record
  const initialPermissions = permissions.reduce(
    (acc, { code }) => ({ ...acc, [code]: false }),
    {} as Record<PermissionEnum, boolean>,
  );

  const methods = useForm({
    defaultValues: {
      appName: "",
      fullAccess: false,
      permissions: initialPermissions,
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const fullAccess = watch("fullAccess");

  // When full access changes, update all permissions
  useEffect(() => {
    if (fullAccess) {
      const allPermissions = permissions.reduce(
        (acc, { code }) => ({ ...acc, [code]: true }),
        {} as Record<PermissionEnum, boolean>,
      );

      setValue("permissions", allPermissions);
    } else {
      setValue("permissions", initialPermissions);
    }
  }, [fullAccess, setValue, permissions]);

  const onSubmit: SubmitHandler<CustomExtensionFormData> = async data => {
    // TODO: Add submit
    console.log("Form data:", data);
    navigate(ExtensionsUrls.resolveInstalledExtensionsUrl());
  };

  return (
    <>
      <TopNav
        href={ExtensionsUrls.resolveInstalledExtensionsUrl()}
        __height="auto"
        title={intl.formatMessage(headerTitles.addCustomExtension)}
        subtitle={
          <FormattedMessage
            {...messages.learnMoreCustomExtensions}
            values={{
              customExtensionDocsLink: (
                <ExternalLinkUnstyled href={CUSTOM_EXTENSIONS_DOCS_URL} target="_blank">
                  <FormattedMessage {...messages.learnMoreCustomExtensionsLinkText} />
                </ExternalLinkUnstyled>
              ),
            }}
          />
        }
      ></TopNav>

      <Box
        paddingX={6}
        marginTop={10}
        display="flex"
        flexDirection="column"
        gap={10}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <Text size={5} fontWeight="medium" as="h2" marginBottom={2}>
            <FormattedMessage {...formLabels.appName} />
          </Text>
          <Box __maxWidth="370px">
            <HookFormInput
              control={control}
              name="appName"
              placeholder={intl.formatMessage(formLabels.appNamePlaceholder)}
              error={!!errors.appName}
              helperText={errors.appName?.message as string}
            />
          </Box>
        </Box>

        <Box>
          <Text size={5} fontWeight="medium" as="h2" marginBottom={2}>
            <FormattedMessage {...formLabels.permissions} />
          </Text>
          <Text display="block" marginBottom={4}>
            <FormattedMessage {...infoMessages.permissionsDescription} />
          </Text>

          <Box marginBottom={4}>
            <HookFormCheckbox name="fullAccess" control={control}>
              <Text size={3}>{intl.formatMessage(infoMessages.grantFullAccess)}</Text>
            </HookFormCheckbox>
          </Box>

          <Box display="grid" gridTemplateColumns={2} gap={4}>
            {permissions.map(permission => (
              <Box key={permission.code}>
                <HookFormCheckbox
                  name={`permissions.${permission.code}` as any}
                  control={control}
                  disabled={fullAccess}
                >
                  <Box display="flex" flexDirection="column">
                    <Text>{permission.name}</Text>
                    <Text size={2} color="default2">
                      {permission.code}
                    </Text>
                  </Box>
                </HookFormCheckbox>
              </Box>
            ))}
          </Box>
        </Box>

        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton href={ExtensionsUrls.resolveInstalledExtensionsUrl()} />
          <Savebar.ConfirmButton
            disabled={!isValid || isSubmitting}
            transitionState={isSubmitting ? "loading" : "default"}
            onClick={handleSubmit(onSubmit)}
          ></Savebar.ConfirmButton>
        </Savebar>
      </Box>
    </>
  );
}
