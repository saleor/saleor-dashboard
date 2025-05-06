import { TopNav } from "@dashboard/components/AppLayout";
import { Callout, calloutTitleMessages } from "@dashboard/components/Callout";
import { HookFormInput } from "@dashboard/components/HookFormInput";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { ExternalLinkUnstyled } from "@dashboard/extensions/components/ExternalLinkUnstyled";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { CUSTOM_EXTENSIONS_DOCS_URL } from "@dashboard/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { z } from "zod";

import { formLabels, headerTitles, infoMessages, messages } from "../../messages";
import { PermissionCheckbox } from "./components/PermissionCheckbox";
import { useHandleCreateAppSubmit } from "./hooks/useHandleCreateAppSubmit";
import { useFullAccessToggle } from "./hooks/useIsFullAccessSelected";
import { usePermissions } from "./hooks/usePermissions";
import { useUserAppCreationPermissions } from "./hooks/useUserAppCreationPermissions";
import { useUserPermissionSet } from "./hooks/useUserPermissionMap";
import { getNoPermissionsObject } from "./utils";

const createFormSchema = (intl: IntlShape) => {
  return z.object({
    appName: z.string().min(1, { message: intl.formatMessage(messages.missingAppNameError) }),
    permissions: z.record(z.boolean()),
  });
};

export type CustomExtensionFormData = z.infer<ReturnType<typeof createFormSchema>>;

export function AddCustomExtension({ setToken }: { setToken: (token: string) => void }) {
  const intl = useIntl();
  const permissions = usePermissions();

  const methods = useForm<CustomExtensionFormData>({
    defaultValues: {
      appName: "",
      // Initialize permissions record - all permissions are disabled by default
      permissions: getNoPermissionsObject(permissions),
    },
    resolver: zodResolver(createFormSchema(intl)),
    // Wait until permissions are fetched
    disabled: permissions.length === 0,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  const submitCreateApp = useHandleCreateAppSubmit({
    setToken,
    setError,
  });

  // Permissions are fetched asynchronously
  // set them as default form values once they are loaded
  useEffect(() => {
    if (permissions.length > 0) {
      reset({
        appName: "",
        permissions: getNoPermissionsObject(permissions),
      });
    }
  }, [reset, permissions]);

  const { toggleFullAccess, isFullAccess } = useFullAccessToggle({
    permissions,
    control,
    setValue,
  });

  const permissionsExceeded = useUserAppCreationPermissions();
  const userPermissionSet = useUserPermissionSet();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
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

      <DetailPageLayout.Content hideScrollbar={false}>
        <Box
          paddingX={6}
          marginTop={10}
          paddingBottom={4}
          display="flex"
          flexDirection="column"
          gap={10}
          as="form"
          onSubmit={handleSubmit(submitCreateApp)}
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
              />
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={6}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Text size={5} fontWeight="medium" as="h2">
                <FormattedMessage {...formLabels.permissions} />
              </Text>
              <Text display="block">
                <FormattedMessage {...infoMessages.permissionsDescription} />
              </Text>
              {!permissionsExceeded && (
                <Checkbox checked={isFullAccess} onCheckedChange={toggleFullAccess} marginTop={4}>
                  <Text size={3}>{intl.formatMessage(infoMessages.grantFullAccess)}</Text>
                </Checkbox>
              )}
            </Box>

            {permissionsExceeded && (
              <Callout
                type="warning"
                title={<FormattedMessage {...calloutTitleMessages.warning} />}
              >
                <FormattedMessage {...messages.customExtensionPermissionWarning} />
              </Callout>
            )}

            <Box
              display="grid"
              marginTop={4}
              gridTemplateColumns={{
                tablet: 2,
                mobile: 1,
              }}
              gap={6}
              __maxWidth="1200px"
            >
              {permissions.map(permission => (
                <PermissionCheckbox
                  key={permission.code}
                  permissionCode={permission.code}
                  permissionName={permission.name}
                  control={control}
                  userPermissionSet={userPermissionSet}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DetailPageLayout.Content>

      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton href={ExtensionsUrls.resolveInstalledExtensionsUrl()} />
        <Savebar.ConfirmButton
          disabled={isSubmitting}
          transitionState={isSubmitting ? "loading" : "default"}
          onClick={handleSubmit(submitCreateApp)}
        ></Savebar.ConfirmButton>
      </Savebar>
    </DetailPageLayout>
  );
}
