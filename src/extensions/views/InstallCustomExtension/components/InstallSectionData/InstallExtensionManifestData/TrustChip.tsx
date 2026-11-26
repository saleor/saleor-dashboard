import { manifestMessages } from "@dashboard/extensions/components/AppDefinition/messages";
import { Chip } from "@saleor/macaw-ui-next";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { useIntl } from "react-intl";

export const TrustChip = ({ isOfficial }: { isOfficial: boolean }) => {
  const intl = useIntl();

  return isOfficial ? (
    <Chip
      size="large"
      backgroundColor="success1"
      borderColor="success1"
      color="success1"
      gap={1}
      data-test-id="install-official-chip"
    >
      <ShieldCheck size={14} />
      {intl.formatMessage(manifestMessages.officialChip)}
    </Chip>
  ) : (
    <Chip
      size="large"
      backgroundColor="warning1"
      borderColor="warning1"
      color="default1"
      gap={1}
      data-test-id="install-external-chip"
    >
      <TriangleAlert size={14} />
      {intl.formatMessage(manifestMessages.externalChip)}
    </Chip>
  );
};
