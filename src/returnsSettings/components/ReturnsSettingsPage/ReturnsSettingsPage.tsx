import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import { Savebar } from "@dashboard/components/Savebar";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  useModelsOfTypeQuery,
  useModelTypesQuery,
  useReturnReasonReferenceClearMutation,
  useReturnSettingsQuery,
  useReturnSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { pageCreateUrl } from "@dashboard/modeling/urls";
import { pageTypeAddUrl, pageTypeUrl } from "@dashboard/modelTypes/urls";
import { returnsSettingsPageMessages } from "@dashboard/returnsSettings/components/ReturnsSettingsPage/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Combobox, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

const formSchema = z.object({
  returnReasonReferenceType: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export const ReturnsSettingsPage = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { loading: settingsLoading, data: returnSettingsData } = useReturnSettingsQuery();

  const returnRefModelTypeId = returnSettingsData?.returnSettings.reasonReferenceType?.id ?? null;

  const { loading: modelTypesLoading, data: modelsList } = useModelTypesQuery();

  // TODO: Missing pagination, will fail if more than 100 types
  const modelTypesOptions = modelsList?.pageTypes?.edges
    .map(edge => edge.node)
    .map(node => {
      return {
        value: node.id,
        label: node.name,
      };
    });

  const modelTypesOptionsWithEmptyValue = [
    {
      value: "",
      label: intl.formatMessage({
        defaultMessage: "None",
        id: "450Fty",
      }),
    },
  ].concat(modelTypesOptions ?? []);

  const { handleSubmit, getValues, setValue, watch } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      returnReasonReferenceType: returnRefModelTypeId ?? "",
    },
  });

  const currentReturnReasonReferenceType = getValues("returnReasonReferenceType");

  const { data: exampleModelData } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: currentReturnReasonReferenceType,
    },
    skip: !currentReturnReasonReferenceType,
  });

  const [updateSettings] = useReturnSettingsUpdateMutation({
    onCompleted() {
      notify({
        status: "success",
        text: "Return reason reference type updated successfully",
      });
    },
    onError(error) {
      notify({
        status: "error",
        title: "Failed to update return reason reference type",
        text: error.message,
      });
    },
  });
  const [clearReferenceType] = useReturnReasonReferenceClearMutation({
    onCompleted() {
      notify({
        status: "success",
        text: "Return reason reference was cleared",
      });
    },
    onError(error) {
      notify({
        status: "error",
        title: "Failed to clear return reason reference",
        text: error.message,
      });
    },
  });

  watch("returnReasonReferenceType");

  const selectedTypeLabel = modelsList?.pageTypes?.edges.find(
    edge => edge.node.id === currentReturnReasonReferenceType,
  )?.node.name;

  const exampleModels = exampleModelData?.pages?.edges.map(edge => edge.node) ?? [];

  const anythingIsLoading = settingsLoading || modelTypesLoading;

  useEffect(() => {
    setValue("returnReasonReferenceType", returnRefModelTypeId ?? "");
  }, [returnRefModelTypeId]);

  const onSubmit = (values: FormSchema) => {
    if (values.returnReasonReferenceType) {
      return updateSettings({
        variables: {
          returnSettingsInput: {
            returnReasonReferenceType: values.returnReasonReferenceType,
          },
        },
      });
    }

    if (values.returnReasonReferenceType === "") {
      return clearReferenceType();
    }
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(returnsSettingsPageMessages.pageTitle)}
      />
      <DetailPageLayout.Content>
        <form onSubmit={handleSubmit(onSubmit)} id="return-reason-settings-form">
          <Box display="grid" __gridTemplateColumns="1fr 2fr 1fr" gap={6} paddingX={6}>
            <PageSectionHeader
              title={intl.formatMessage(returnsSettingsPageMessages.explainerTitle)}
              description={intl.formatMessage(returnsSettingsPageMessages.explainerContent)}
            />
            <Box marginTop={6} __maxWidth="700px">
              {anythingIsLoading ? (
                <Skeleton />
              ) : (
                <>
                  <Text fontWeight="medium" display="block" marginBottom={2}>
                    {intl.formatMessage(returnsSettingsPageMessages.selectLabel)}
                  </Text>
                  <Combobox
                    options={modelTypesOptionsWithEmptyValue}
                    value={currentReturnReasonReferenceType}
                    onChange={value => setValue("returnReasonReferenceType", value as string)}
                  />
                  <Box marginTop={2}>
                    <Text color="default2">
                      {intl.formatMessage(returnsSettingsPageMessages.selectHelper)}{" "}
                    </Text>
                    <Link target={"_blank"} href={pageTypeAddUrl}>
                      <Text color="inherit">
                        {intl.formatMessage(returnsSettingsPageMessages.createModelTypeLink)}
                      </Text>
                    </Link>
                  </Box>
                </>
              )}
            </Box>
            {!!currentReturnReasonReferenceType && (
              <Box marginTop={6}>
                <Text fontWeight="medium" display="block" marginBottom={2}>
                  {intl.formatMessage(returnsSettingsPageMessages.previewTitle)}{" "}
                  <Link href={pageTypeUrl(currentReturnReasonReferenceType)}>
                    {selectedTypeLabel}
                  </Link>
                </Text>
                {exampleModels.length > 0 && (
                  <Box marginTop={4}>
                    <Box marginTop={6} display="flex" flexDirection="column">
                      {exampleModels.map(model => (
                        <Text disabled key={model.id}>
                          - {model.title}
                        </Text>
                      ))}
                    </Box>
                  </Box>
                )}
                {exampleModels.length === 0 && (
                  <Text>
                    {intl.formatMessage(returnsSettingsPageMessages.emptyModels)}{" "}
                    <Link
                      href={pageCreateUrl({ "page-type-id": currentReturnReasonReferenceType })}
                    >
                      {intl.formatMessage(returnsSettingsPageMessages.createModelLink)}
                    </Link>
                  </Text>
                )}
              </Box>
            )}
          </Box>

          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
            <Savebar.ConfirmButton
              form="return-reason-settings-form"
              transitionState={anythingIsLoading ? "loading" : "default"}
              disabled={anythingIsLoading}
              type="submit"
            />
          </Savebar>
        </form>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
