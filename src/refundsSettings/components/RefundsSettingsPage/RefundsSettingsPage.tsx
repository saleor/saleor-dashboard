import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderSettingsPath } from "@dashboard/orders/urls";
import { refundsSettingsPageMessages } from "@dashboard/refundsSettings/components/RefundsSettingsPage/messages";
import { FormattedMessage, useIntl } from "react-intl";

import { ReasonSettingsSection } from "./ReasonSettingsSection";
import { type ModelTypeOption } from "./types";

interface RefundsSettingsPageProps {
  loading: boolean;
  disabled: boolean;
  isSaveDisabled: boolean;
  modelTypesOptions: ModelTypeOption[];
  onRefundReasonChange: (value: string) => void;
  onReturnReasonChange: (value: string) => void;
  onSubmit: () => void;
  refundReasonReferenceType: string;
  returnReasonReferenceType: string;
  saveButtonBarState: ConfirmButtonTransitionState;
}

export const RefundsSettingsPage = ({
  loading,
  disabled,
  isSaveDisabled,
  modelTypesOptions,
  onRefundReasonChange,
  onReturnReasonChange,
  onSubmit,
  refundReasonReferenceType,
  returnReasonReferenceType,
  saveButtonBarState,
}: RefundsSettingsPageProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <SettingsHubLayout
      backHref={orderSettingsPath}
      title={intl.formatMessage(refundsSettingsPageMessages.pageTitle)}
    >
      <form
        id="refund-reason-settings-form"
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
        style={{ width: "100%", display: "block" }}
      >
        <SettingsPageContent
          description={<FormattedMessage {...refundsSettingsPageMessages.pageDescription} />}
        >
          <ReasonSettingsSection
            id={settingsHashes.refundsRefundReasons}
            data-test-id="refund-reason-settings"
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
            value={refundReasonReferenceType}
            onChange={onRefundReasonChange}
            loading={loading}
            disabled={disabled}
          />
          <ReasonSettingsSection
            id={settingsHashes.refundsReturnReasons}
            data-test-id="return-reason-settings"
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
            value={returnReasonReferenceType}
            onChange={onReturnReasonChange}
            loading={loading}
            disabled={disabled}
          />
        </SettingsPageContent>
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(orderSettingsPath)} />
          <Savebar.ConfirmButton
            form="refund-reason-settings-form"
            transitionState={saveButtonBarState}
            disabled={disabled || isSaveDisabled}
            type="submit"
          />
        </Savebar>
      </form>
    </SettingsHubLayout>
  );
};
