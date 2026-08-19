import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { pageCreateUrl, pageUrl } from "@dashboard/modeling/urls";
import { pageTypeUrl } from "@dashboard/modelTypes/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import styles from "./ReasonModelsPreview.module.css";

interface ReasonModelsPreviewProps {
  pageTypeId: string;
  pageTypeLabel: string;
  previewTitle: string;
  emptyModelsLabel: string;
  createModelLabel: string;
}

export const ReasonModelsPreview = ({
  pageTypeId,
  pageTypeLabel,
  previewTitle,
  emptyModelsLabel,
  createModelLabel,
}: ReasonModelsPreviewProps): JSX.Element => {
  const { data: exampleModelData, loading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId,
    },
    skip: !pageTypeId,
  });

  const exampleModels = exampleModelData?.pages?.edges.map(edge => edge.node) ?? [];

  return (
    <Box className={styles.preview} paddingX={6} paddingY={5}>
      <Text size={2} fontWeight="medium" display="block" marginBottom={3}>
        {previewTitle} <MicrocopyLink to={pageTypeUrl(pageTypeId)}>{pageTypeLabel}</MicrocopyLink>
      </Text>
      {loading ? (
        <Text size={2} color="default2">
          <FormattedMessage
            id="qjdfEH"
            defaultMessage="Loading models…"
            description="loading state for reason models preview on refunds settings"
          />
        </Text>
      ) : exampleModels.length > 0 ? (
        <Box as="ul" className={styles.list} margin={0} padding={0}>
          {exampleModels.map(model => (
            <Box as="li" key={model.id} className={styles.listItem}>
              <Text size={2} color="default2">
                <MicrocopyLink to={pageUrl(model.id)}>{model.title}</MicrocopyLink>
              </Text>
            </Box>
          ))}
        </Box>
      ) : (
        <Text size={2} color="default2">
          {emptyModelsLabel}{" "}
          <MicrocopyLink to={pageCreateUrl({ "page-type-id": pageTypeId })}>
            {createModelLabel}
          </MicrocopyLink>
        </Text>
      )}
    </Box>
  );
};
