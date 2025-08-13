import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import { Savebar } from "@dashboard/components/Savebar";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  useModelsOfTypeQuery,
  useModelTypesQuery,
  useRefundReasonReferenceClearMutation,
  useRefundSettingsQuery,
  useRefundSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { pageTypeAddUrl, pageTypeUrl } from "@dashboard/modelTypes/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Combobox, Skeleton,Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  refundReasonReferenceType: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export const RefundsSettingsPage = () => {
  const navigate = useNavigator();
  const notify = useNotifier();

  const { loading: settingsLoading, data: refundSettingsData } = useRefundSettingsQuery();

  const refundRefModelTypeId = refundSettingsData?.refundSettings.reasonReferenceType?.id ?? null;

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
      label: "Select model",
    },
  ].concat(modelTypesOptions ?? []);

  const { handleSubmit, getValues, setValue, watch } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      refundReasonReferenceType: refundRefModelTypeId ?? "",
    },
  });

  const currentRefundReasonReferenceType = getValues("refundReasonReferenceType");

  const { data: exampleModelData } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: currentRefundReasonReferenceType,
    },
    skip: !currentRefundReasonReferenceType,
  });

  const [updateSettings] = useRefundSettingsUpdateMutation({
    onCompleted() {
      notify({
        status: "success",
        text: "Refund reason reference type updated successfully",
      });
    },
    onError(error) {
      notify({
        status: "error",
        title: "Failed to update refund reason reference type",
        text: error.message,
      });
    },
  });
  const [clearReferenceType] = useRefundReasonReferenceClearMutation({
    onCompleted() {
      notify({
        status: "success",
        text: "Refund reason reference was cleared",
      });
    },
    onError(error) {
      notify({
        status: "error",
        title: "Failed to clear refund reason reference",
        text: error.message,
      });
    },
  });

  watch("refundReasonReferenceType");

  const exampleModels = exampleModelData?.pages?.edges.map(edge => edge.node) ?? [];
  const maxExamplesCount = 10;

  const exampleModelsTruncated = exampleModels.slice(0, maxExamplesCount);

  const anythingIsLoading = settingsLoading || modelTypesLoading;

  useEffect(() => {
    setValue("refundReasonReferenceType", refundRefModelTypeId ?? "");
  }, [refundRefModelTypeId]);

  const onSubmit = (values: FormSchema) => {
    if (values.refundReasonReferenceType) {
      return updateSettings({
        variables: {
          refundSettingsInput: {
            refundReasonReferenceType: values.refundReasonReferenceType,
          },
        },
      });
    }

    if (values.refundReasonReferenceType === "") {
      return clearReferenceType();
    }
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={configurationMenuUrl} title="Refunds settings" />
      <DetailPageLayout.Content>
        <form onSubmit={handleSubmit(onSubmit)} id="asd">
          <Box gap={2}>
            <Box display="grid" __gridTemplateColumns="1fr 3fr" paddingLeft={6}>
              <PageSectionHeader
                title="Refund reasons"
                description="Configure allowed refund reasons. You can attach it to one of existing Model Types. Once it happens, refund creation will require to specify a related reason (of selected type)."
              />
              <Box margin={12} __maxWidth="700px">
                {anythingIsLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <Combobox
                      options={modelTypesOptionsWithEmptyValue}
                      value={currentRefundReasonReferenceType}
                      onChange={value => setValue("refundReasonReferenceType", value as string)}
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      marginTop={4}
                      alignItems="end"
                    >
                      {currentRefundReasonReferenceType && (
                        <Link
                          href={pageTypeUrl(currentRefundReasonReferenceType)}
                          target={"_blank"}
                        >
                          Open in a new tab
                        </Link>
                      )}
                      <Link target={"_blank"} href={pageTypeAddUrl}>
                        Create new type in a new tab
                      </Link>
                    </Box>
                    {exampleModels.length > 0 && (
                      <Box marginTop={4}>
                        <Text fontWeight="bold">Following models will be available to select:</Text>
                        <Box display="flex" gap={3} flexDirection="column" marginTop={6}>
                          {exampleModelsTruncated.map(model => (
                            <Text key={model.id}>{model.title}</Text>
                          ))}
                          {exampleModels.length > maxExamplesCount && (
                            <Text color="default2">
                              ... and {exampleModels.length - exampleModelsTruncated.length} more
                            </Text>
                          )}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
            <Savebar.ConfirmButton
              form="asd"
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
