import { AnnouncementImportanceEnum } from "@dashboard/graphql";
import { type BoxProps } from "@saleor/macaw-ui-next";

interface AnnouncementSeverityStyle {
  backgroundColor: BoxProps["backgroundColor"];
  borderColor: BoxProps["borderColor"];
  titleColor: BoxProps["color"];
}

/**
 * Maps an announcement's importance to its visual treatment.
 *
 * - CRITICAL / HIGH → critical (red) styling
 * - MODERATE        → warning (yellow) styling
 * - LOW / UNSET     → neutral styling
 */
export const getSeverityStyle = (
  importance: AnnouncementImportanceEnum,
): AnnouncementSeverityStyle => {
  switch (importance) {
    case AnnouncementImportanceEnum.CRITICAL:
    case AnnouncementImportanceEnum.HIGH:
      return {
        backgroundColor: "critical1",
        borderColor: "critical1",
        titleColor: "critical2",
      };
    case AnnouncementImportanceEnum.MODERATE:
      return {
        backgroundColor: "warning1",
        borderColor: "warning1",
        titleColor: "warning1",
      };
    case AnnouncementImportanceEnum.LOW:
    case AnnouncementImportanceEnum.UNSET:
    default:
      return {
        backgroundColor: "default1",
        borderColor: "default1",
        titleColor: "default1",
      };
  }
};
