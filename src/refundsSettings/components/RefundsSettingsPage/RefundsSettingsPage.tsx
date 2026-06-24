import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  useModelTypesQuery,
  useRefundReasonReferenceClearMutation,
  useRefundSettingsQuery,
  useRefundSettingsUpdateMutation,
  useReturnReasonReferenceClearMutation,
  useReturnSettingsQuery,
  useReturnSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { refundsSettingsPageMessages } from "@dashboard/refundsSettings/components/RefundsSettingsPage/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@saleor/macaw-ui-next";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

import { ReasonSettingsSection } from "./ReasonSettingsSection";

const formSchema = z.object({
  refundReasonReferenceType: z.string(),
  returnReasonReferenceType: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export const RefundsSettingsPage = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { loading: refundSettingsLoading, data: refundSettingsData } = useRefundSettingsQuery();
  const { loading: returnSettingsLoading, data: returnSettingsData } = useReturnSettingsQuery();

  const refundRefModelTypeId = refundSettingsData?.refundSettings.reasonReferenceType?.id ?? "";
  const returnRefModelTypeId = returnSettingsData?.returnSettings.reasonReferenceType?.id ?? "";

  const { loading: modelTypesLoading, data: modelsList } = useModelTypesQuery();

  // TODO: Missing pagination, will fail if more than 100 types
  const modelTypesOptions = [
    {
      value: "",
      label: intl.formatMessage(refundsSettingsPageMessages.noneOption),
    },
    ...(modelsList?.pageTypes?.edges.map(edge => ({
      value: edge.node.id,
      label: edge.node.name,
    })) ?? []),
  ];

  const { setValue, watch, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      refundReasonReferenceType: refundRefModelTypeId,
      returnReasonReferenceType: returnRefModelTypeId,
    },
  });

  const refundValue = watch("refundReasonReferenceType");
  const returnValue = watch("returnReasonReferenceType");

  const [updateRefundSettings] = useRefundSettingsUpdateMutation({
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
  const [clearRefundReferenceType] = useRefundReasonReferenceClearMutation({
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

  const [updateReturnSettings] = useReturnSettingsUpdateMutation({
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
  const [clearReturnReferenceType] = useReturnReasonReferenceClearMutation({
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

  const anythingIsLoading = refundSettingsLoading || returnSettingsLoading || modelTypesLoading;

  const onSubmit = async (values: FormSchema) => {
    const refundChanged = values.refundReasonReferenceType !== refundRefModelTypeId;
    const returnChanged = values.returnReasonReferenceType !== returnRefModelTypeId;

    await Promise.all([
      refundChanged
        ? values.refundReasonReferenceType
          ? updateRefundSettings({
              variables: {
                refundSettingsInput: {
                  refundReasonReferenceType: values.refundReasonReferenceType,
                },
              },
            })
          : clearRefundReferenceType()
        : Promise.resolve(),
      returnChanged
        ? values.returnReasonReferenceType
          ? updateReturnSettings({
              variables: {
                returnSettingsInput: {
                  returnReasonReferenceType: values.returnReasonReferenceType,
                },
              },
            })
          : clearReturnReferenceType()
        : Promise.resolve(),
    ]);
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(refundsSettingsPageMessages.pageTitle)}
      />
      <DetailPageLayout.Content>
        <form onSubmit={handleSubmit(onSubmit)} id="refund-reason-settings-form">
          <Box display="flex" flexDirection="column" gap={10} paddingTop={6}>
            <ReasonSettingsSection
              title={intl.formatMessage(refundsSettingsPageMessages.refundExplainerTitle)}
              description={intl.formatMessage(refundsSettingsPageMessages.refundExplainerContent)}
              selectLabel={intl.formatMessage(refundsSettingsPageMessages.refundSelectLabel)}
              selectHelper={intl.formatMessage(refundsSettingsPageMessages.refundSelectHelper)}
              previewTitle={intl.formatMessage(refundsSettingsPageMessages.refundPreviewTitle)}
              emptyModelsLabel={intl.formatMessage(refundsSettingsPageMessages.emptyModels)}
              createModelTypeLabel={intl.formatMessage(
                refundsSettingsPageMessages.createModelTypeLink,
              )}
              createModelLabel={intl.formatMessage(refundsSettingsPageMessages.createModelLink)}
              modelTypesOptions={modelTypesOptions}
              value={refundValue}
              onChange={value => setValue("refundReasonReferenceType", value)}
              loading={anythingIsLoading}
            />
            <ReasonSettingsSection
              title={intl.formatMessage(refundsSettingsPageMessages.returnExplainerTitle)}
              description={intl.formatMessage(refundsSettingsPageMessages.returnExplainerContent)}
              selectLabel={intl.formatMessage(refundsSettingsPageMessages.returnSelectLabel)}
              selectHelper={intl.formatMessage(refundsSettingsPageMessages.returnSelectHelper)}
              previewTitle={intl.formatMessage(refundsSettingsPageMessages.returnPreviewTitle)}
              emptyModelsLabel={intl.formatMessage(refundsSettingsPageMessages.emptyModels)}
              createModelTypeLabel={intl.formatMessage(
                refundsSettingsPageMessages.createModelTypeLink,
              )}
              createModelLabel={intl.formatMessage(refundsSettingsPageMessages.createModelLink)}
              modelTypesOptions={modelTypesOptions}
              value={returnValue}
              onChange={value => setValue("returnReasonReferenceType", value)}
              loading={anythingIsLoading}
            />
          </Box>

          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
            <Savebar.ConfirmButton
              form="refund-reason-settings-form"
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
