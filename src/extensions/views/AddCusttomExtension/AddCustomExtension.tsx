import { TopNav } from "@dashboard/components/AppLayout";
import { Callout, calloutTitleMessages } from "@dashboard/components/Callout";
import { HookFormCheckbox } from "@dashboard/components/HookFormCheckbox";
import { HookFormInput } from "@dashboard/components/HookFormInput";
import { Savebar } from "@dashboard/components/Savebar";
import { ExternalLinkUnstyled } from "@dashboard/extensions/components/ExternalLinkUnstyled";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useAppCreateMutation } from "@dashboard/graphql";
import { PermissionEnum, PermissionFragment } from "@dashboard/graphql/types.generated";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { CUSTOM_EXTENSIONS_DOCS_URL } from "@dashboard/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { z } from "zod";

import { formLabels, headerTitles, infoMessages, messages } from "../../messages";
import { useUserAppCreationPermissions } from "./hooks/useUserAppCreationPermissions";

const formSchema = z.object({
  appName: z.string().min(1, { message: "App name is required" }),
  permissions: z.record(z.boolean()),
});

const getNoPermissionsObject = (permissions: PermissionFragment[]) => {
  /**
   * Object: {
   *   MANAGE_ORDERS: false
   *   ...
   * }
   * */
  return permissions.reduce(
    (acc, { code }) => ({ ...acc, [code]: false }),
    {} as Record<PermissionEnum, boolean>,
  );
};

const getAllPermissionsObject = (permissions: PermissionFragment[]) => {
  /**
   * Object: {
   *   MANAGE_ORDERS: true
   *   ...
   * }
   * */
  return permissions.reduce(
    (acc, { code }) => ({ ...acc, [code]: true }),
    {} as Record<PermissionEnum, boolean>,
  );
};

export type CustomExtensionFormData = z.infer<typeof formSchema>;

export function AddCustomExtension({ setToken }: { setToken: (token: string) => void }) {
  const intl = useIntl();
  const notify = useNotifier();

  const navigate = useNavigator();
  const shop = useShop();
  const permissions = shop?.permissions ?? [];

  // Initialize permissions record - all permissions are disabled by edfualt

  const methods = useForm<CustomExtensionFormData>({
    defaultValues: {
      appName: "",
      permissions: getNoPermissionsObject(permissions),
    },
    resolver: zodResolver(formSchema),
    disabled: permissions.length === 0,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (permissions.length > 0) {
      reset({
        appName: "",
        permissions: getNoPermissionsObject(permissions),
      });
    }
  }, [shop, reset]);

  const [createApp, createAppOpts] = useAppCreateMutation({
    onCompleted: data => {
      if (data.appCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(ExtensionsUrls.editCustomExtensionUrl(data.appCreate.app.id));
        setToken(data.appCreate.authToken);
      }
    },
  });

  const onSubmit: SubmitHandler<CustomExtensionFormData> = async data => {
    await createApp({
      variables: {
        input: {
          name: data.appName,
          permissions: Object.entries(data.permissions)
            .filter(([value]) => value)
            .map(([key]) => key as PermissionEnum),
        },
      },
    });
  };

  const selectedPermissions = useWatch({ name: "permissions", control });
  // const selectedPermissions = watch("permissions");

  const isFullAccess = useMemo(() => {
    // Wait until permissions are loaded
    if (permissions.length === 0) {
      return false;
    }

    return Object.entries(selectedPermissions).every(([_, value]) => value);
  }, [selectedPermissions]);

  const toggleFullAccess = () => {
    if (isFullAccess) {
      setValue("permissions", getNoPermissionsObject(permissions));
    } else {
      setValue("permissions", getAllPermissionsObject(permissions));
    }
  };

  const permissionsExceeded = useUserAppCreationPermissions();

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
        paddingBottom={4}
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

        <Box display="flex" flexDirection="column" gap={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Text size={5} fontWeight="medium" as="h2" marginBottom={2}>
              <FormattedMessage {...formLabels.permissions} />
            </Text>
            <Text display="block" marginBottom={4}>
              <FormattedMessage {...infoMessages.permissionsDescription} />
            </Text>
            <Checkbox checked={isFullAccess} onCheckedChange={toggleFullAccess}>
              <Text size={3}>{intl.formatMessage(infoMessages.grantFullAccess)}</Text>
            </Checkbox>
          </Box>

          {permissionsExceeded && (
            <Callout type="warning" title={<FormattedMessage {...calloutTitleMessages.warning} />}>
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
              <Box key={permission.code}>
                <HookFormCheckbox
                  name={`permissions.${permission.code}`}
                  control={control}
                  alignItems="flex-start"
                >
                  <Box display="flex" flexDirection="column" __marginTop="-4px">
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
            disabled={isSubmitting}
            transitionState={isSubmitting ? "loading" : "default"}
            onClick={handleSubmit(onSubmit)}
          ></Savebar.ConfirmButton>
        </Savebar>
      </Box>
    </>
  );
}
