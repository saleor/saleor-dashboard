import { TopNavDestinationIcon } from "@dashboard/components/AppLayout/TopNav/destinationIcons";
import { topNavDestinationMessages } from "@dashboard/components/AppLayout/TopNav/destinationMessages";
import Form from "@dashboard/components/Form";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
  useGiftCardSettingsUpdateMutation,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import { parseQs } from "@dashboard/url-utils";
import { getFormErrors } from "@dashboard/utils/errors";
import { type ReactNode } from "react";
import { FormattedMessage, type IntlShape, useIntl } from "react-intl";
import useRouter from "use-react-router";

import { giftCardListUrl, type GiftCardSettingsUrlQueryParams } from "../urls";
import { GiftCardExpirySettingsCard } from "./GiftCardExpirySettingsCard/GiftCardExpirySettingsCard";
import { type GiftCardSettingsFormData } from "./types";
import { getGiftCardSettingsInputData } from "./utils";

const getGiftCardSettingsExit = (
  search: string,
  intl: IntlShape,
): { href: string; icon: ReactNode; title: string } => {
  const params = parseQs(
    search.startsWith("?") ? search.slice(1) : search,
  ) as GiftCardSettingsUrlQueryParams;

  if (params.from === "gift-cards") {
    return {
      href: giftCardListUrl(),
      icon: <TopNavDestinationIcon.giftCards />,
      title: intl.formatMessage(topNavDestinationMessages.allGiftCards),
    };
  }

  return {
    href: configurationMenuUrl,
    icon: <TopNavDestinationIcon.configuration />,
    title: intl.formatMessage(topNavDestinationMessages.configuration),
  };
};

export const GiftCardSettingsPage = (): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const {
    location: { search },
  } = useRouter();
  const exit = getGiftCardSettingsExit(search, intl);
  const { data, loading } = useGiftCardSettingsQuery();
  const settingsData = data?.giftCardSettings;
  const initialData: GiftCardSettingsFormData = {
    expiryPeriodActive: settingsData?.expiryType === GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD,
    expiryPeriodType: settingsData?.expiryPeriod?.type || TimePeriodTypeEnum.YEAR,
    expiryPeriodAmount: settingsData?.expiryPeriod?.amount || 1,
  };
  const [updateGiftCardSettings, updateGiftCardSettingsOpts] = useGiftCardSettingsUpdateMutation({
    onCompleted: (data): void => {
      if (!data.giftCardSettingsUpdate?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });
  const handleSubmit = (formData: GiftCardSettingsFormData): SubmitPromise =>
    extractMutationErrors(
      updateGiftCardSettings({
        variables: {
          input: getGiftCardSettingsInputData(formData),
        },
      }),
    );
  const formLoading = loading || updateGiftCardSettingsOpts?.loading;
  const apiErrors = updateGiftCardSettingsOpts?.data?.giftCardSettingsUpdate?.errors;
  const formErrors = getFormErrors(["expiryPeriod"], apiErrors);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <SettingsHubLayout
        backHref={exit.href}
        backHrefIcon={exit.icon}
        backHrefTitle={exit.title}
        title={intl.formatMessage(sectionNames.giftCards)}
      >
        <Form
          key={loading ? "loading" : (settingsData?.expiryType ?? "loaded")}
          initial={initialData}
          onSubmit={handleSubmit}
          confirmLeave
        >
          {({ data: formData, submit, change }) => (
            <>
              <SettingsPageContent
                description={
                  <FormattedMessage
                    id="6/1Urx"
                    defaultMessage="Configure shop-wide defaults for gift cards. Per-card expiration can still be set on each gift card."
                    description="intro under gift card settings page title"
                  />
                }
              >
                <GiftCardExpirySettingsCard
                  data={formData}
                  disabled={formLoading}
                  onChange={change}
                  errors={formErrors}
                />
              </SettingsPageContent>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(exit.href)} />
                <Savebar.ConfirmButton
                  transitionState={updateGiftCardSettingsOpts?.status}
                  onClick={submit}
                  disabled={formLoading}
                />
              </Savebar>
            </>
          )}
        </Form>
      </SettingsHubLayout>
    </>
  );
};
