import { useSuspenseQuery } from "@apollo/client/react/hooks";
import { TopNav } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Link from "@dashboard/components/Link";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import { Savebar } from "@dashboard/components/Savebar";
import { configurationMenuUrl } from "@dashboard/configuration";
import {
  ModelTypesQuery,
  RefundSettingsQuery,
  useModelsOfTypeQuery,
  useRefundReasonReferenceClearMutation,
  useRefundSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { pageCreateUrl } from "@dashboard/modeling/urls";
import { pageTypeAddUrl, pageTypeUrl } from "@dashboard/modelTypes/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Combobox, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { z } from "zod";

import { modelTypes, refundsSettings } from "../../queries";
import { refundsSettingsPageMessages } from "./messages";

const formSchema = z.object({
  refundReasonReferenceType: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

interface RefundsSettingsFormProps {
  refundSettingsData: RefundSettingsQuery;
  modelsList: ModelTypesQuery;
}

const RefundsSettingsForm = ({ refundSettingsData, modelsList }: RefundsSettingsFormProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const refundRefModelTypeId = refundSettingsData?.refundSettings.reasonReferenceType?.id ?? null;

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

  const selectedTypeLabel = modelsList?.pageTypes?.edges.find(
    edge => edge.node.id === currentRefundReasonReferenceType,
  )?.node.name;

  const exampleModels = exampleModelData?.pages?.edges.map(edge => edge.node) ?? [];

  useEffect(() => {
    setValue("refundReasonReferenceType", refundRefModelTypeId ?? "");
  }, [refundRefModelTypeId, setValue]);

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
    <form onSubmit={handleSubmit(onSubmit)} id="refund-reason-settings-form">
      <Box display="grid" __gridTemplateColumns="1fr 2fr 1fr" gap={6} paddingX={6}>
        <PageSectionHeader
          title={intl.formatMessage(refundsSettingsPageMessages.explainerTitle)}
          description={intl.formatMessage(refundsSettingsPageMessages.explainerContent)}
        />
        <Box marginTop={6} __maxWidth="700px">
          <Text fontWeight="medium" display="block" marginBottom={2}>
            {intl.formatMessage(refundsSettingsPageMessages.selectLabel)}
          </Text>
          <Combobox
            options={modelTypesOptionsWithEmptyValue}
            value={currentRefundReasonReferenceType}
            onChange={value => setValue("refundReasonReferenceType", value as string)}
          />
          <Box marginTop={2}>
            <Text color="default2">
              {intl.formatMessage(refundsSettingsPageMessages.selectHelper)}{" "}
            </Text>
            <Link target={"_blank"} href={pageTypeAddUrl}>
              <Text color="inherit">
                {intl.formatMessage(refundsSettingsPageMessages.createModelTypeLink)}
              </Text>
            </Link>
          </Box>
        </Box>
        {!!currentRefundReasonReferenceType && (
          <Box marginTop={6}>
            <Text fontWeight="medium" display="block" marginBottom={2}>
              {intl.formatMessage(refundsSettingsPageMessages.previewTitle)}{" "}
              <Link href={pageTypeUrl(currentRefundReasonReferenceType)}>{selectedTypeLabel}</Link>
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
                {intl.formatMessage(refundsSettingsPageMessages.emptyModels)}{" "}
                <Link href={pageCreateUrl({ "page-type-id": currentRefundReasonReferenceType })}>
                  {intl.formatMessage(refundsSettingsPageMessages.createModelLink)}
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
          form="refund-reason-settings-form"
          transitionState="default"
          type="submit"
        />
      </Savebar>
    </form>
  );
};

const RefundsSettingsContent = () => {
  const { data: refundSettingsData } = useSuspenseQuery<RefundSettingsQuery>(refundsSettings);
  const { data: modelsList } = useSuspenseQuery<ModelTypesQuery>(modelTypes);

  return <RefundsSettingsForm refundSettingsData={refundSettingsData} modelsList={modelsList} />;
};

const LoadingFallback = () => {
  return (
    <Box display="grid" __gridTemplateColumns="1fr 2fr 1fr" gap={6} paddingX={6}>
      <Box />
      <Box marginTop={6} __maxWidth="700px">
        <Skeleton />
      </Box>
    </Box>
  );
};

export const RefundsSettingsPage = () => {
  const intl = useIntl();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(refundsSettingsPageMessages.pageTitle)}
      />
      <DetailPageLayout.Content>
        <Suspense fallback={<LoadingFallback />}>
          <RefundsSettingsContent />
        </Suspense>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
