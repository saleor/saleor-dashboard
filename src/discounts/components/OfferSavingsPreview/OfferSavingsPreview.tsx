import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import {
  type PromotionOfferSavingsPreviewQuery,
  usePromotionOfferSavingsPreviewLazyQuery,
} from "@dashboard/graphql";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  title: {
    id: "aTCWOh",
    defaultMessage: "Offer savings preview",
  },
  description: {
    id: "2BSc10",
    defaultMessage: "Review affected job advertisements and employer pricing before activation.",
  },
  previewOffer: {
    id: "cUZ5hl",
    defaultMessage: "Preview offer",
  },
  initial: {
    id: "oD+y0j",
    defaultMessage: "Select Preview offer to calculate the current campaign impact.",
  },
  error: {
    id: "DcR2sX",
    defaultMessage: "We couldn't load the offer preview. Select Preview offer to try again.",
  },
  emptyTitle: {
    id: "PiNOJH",
    defaultMessage: "No matching offers",
  },
  emptyDescription: {
    id: "SdXHGa",
    defaultMessage: "No matching job advertisements are configured for this campaign.",
  },
  summary: {
    id: "JCJQKi",
    defaultMessage:
      "{offerCount, plural, one {# offer} other {# offers}} across {channelCount, plural, one {# channel} other {# channels}}",
  },
  channel: {
    id: "NRCihE",
    defaultMessage: "Publication channel: {channelSlug}",
  },
  originalPrice: {
    id: "GY4TaU",
    defaultMessage: "Standard listing price",
  },
  promotionalPrice: {
    id: "JqeFqy",
    defaultMessage: "Campaign price",
  },
  savingsAmount: {
    id: "DAx3D1",
    defaultMessage: "Employer savings",
  },
});

export type OfferSavingsPreviewData = NonNullable<
  NonNullable<PromotionOfferSavingsPreviewQuery["promotion"]>["offerSavingsPreview"]
>;

interface OfferSavingsPreviewViewProps {
  called: boolean;
  loading: boolean;
  error: boolean;
  preview?: OfferSavingsPreviewData;
  promotionId: string | null;
  onPreview: () => void;
}

export const OfferSavingsPreviewView = ({
  called,
  loading,
  error,
  preview,
  promotionId,
  onPreview,
}: OfferSavingsPreviewViewProps): JSX.Element => {
  const intl = useIntl();

  return (
    <DashboardCard marginBottom={20} data-test-id="offer-savings-preview">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column">
          <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            {intl.formatMessage(messages.description)}
          </DashboardCard.Subtitle>
        </Box>
        <DashboardCard.Toolbar>
          <Button
            variant="secondary"
            disabled={!promotionId || loading}
            onClick={onPreview}
            data-test-id="preview-offer"
          >
            {intl.formatMessage(messages.previewOffer)}
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content display="flex" flexDirection="column" gap={4}>
        {!called ? <Text color="default2">{intl.formatMessage(messages.initial)}</Text> : null}

        {loading ? (
          <Box display="flex" flexDirection="column" gap={2} data-test-id="preview-loading">
            <Skeleton __height="1rem" __width="12rem" />
            <Skeleton __height="4rem" />
          </Box>
        ) : null}

        {!loading && error ? (
          <Box backgroundColor="critical1" padding={4} borderRadius={3} role="alert">
            <Text>{intl.formatMessage(messages.error)}</Text>
          </Box>
        ) : null}

        {!loading && !error && preview ? (
          <>
            {preview.offers.length === 0 ? (
              <Box display="flex" flexDirection="column" gap={1} data-test-id="preview-empty">
                <Text fontWeight="bold">{intl.formatMessage(messages.emptyTitle)}</Text>
                <Text color="default2">{intl.formatMessage(messages.emptyDescription)}</Text>
              </Box>
            ) : (
              <>
                <Text color="default2" data-test-id="preview-summary">
                  {intl.formatMessage(messages.summary, {
                    offerCount: preview.offerCount,
                    channelCount: preview.channelCount,
                  })}
                </Text>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  __maxHeight="28rem"
                  overflowY="auto"
                  paddingRight={1}
                  data-test-id="offer-preview-list"
                >
                  {preview.offers.map(offer => (
                    <Box
                      key={`${offer.productId}-${offer.channelSlug}`}
                      display="flex"
                      flexDirection="column"
                      gap={3}
                      padding={4}
                      borderWidth={1}
                      borderStyle="solid"
                      borderColor="default1"
                      borderRadius={3}
                      data-test-id="offer-preview-item"
                    >
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Text fontWeight="bold">{offer.productName}</Text>
                        <Text color="default2">
                          {intl.formatMessage(messages.channel, {
                            channelSlug: offer.channelSlug,
                          })}
                        </Text>
                      </Box>
                      <Box
                        display="grid"
                        __gridTemplateColumns="repeat(auto-fit, minmax(9rem, 1fr))"
                        gap={4}
                      >
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Text color="default2">{intl.formatMessage(messages.originalPrice)}</Text>
                          <Money money={offer.originalPrice} />
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Text color="default2">
                            {intl.formatMessage(messages.promotionalPrice)}
                          </Text>
                          <Money money={offer.promotionalPrice} />
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Text color="default2">{intl.formatMessage(messages.savingsAmount)}</Text>
                          <Money money={offer.savingsAmount} />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
            {preview.warnings.map(warning => (
              <Box key={warning.code} backgroundColor="warning1" padding={3} borderRadius={3}>
                <Text>{warning.message}</Text>
              </Box>
            ))}
          </>
        ) : null}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

interface OfferSavingsPreviewProps {
  promotionId: string | null;
}

export const OfferSavingsPreview = ({ promotionId }: OfferSavingsPreviewProps): JSX.Element => {
  const [loadPreview, { called, data, error, loading }] = usePromotionOfferSavingsPreviewLazyQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const onPreview = (): void => {
    if (promotionId) {
      void loadPreview({ variables: { id: promotionId } });
    }
  };

  return (
    <OfferSavingsPreviewView
      called={called}
      loading={loading}
      error={Boolean(error)}
      preview={data?.promotion?.offerSavingsPreview}
      promotionId={promotionId}
      onPreview={onPreview}
    />
  );
};
