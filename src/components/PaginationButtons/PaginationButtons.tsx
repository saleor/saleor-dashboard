import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

interface PaginationButtonsProps {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  /** Disables both arrows, including when a page is available. */
  disabled?: boolean;
  previousTestId?: string;
  nextTestId?: string;
}

const PaginationButtons = ({
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
  disabled = false,
  previousTestId = "button-pagination-back",
  nextTestId = "button-pagination-next",
}: PaginationButtonsProps): ReactNode => {
  const intl = useIntl();

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        type="button"
        disabled={!hasPreviousPage || disabled}
        onClick={onPreviousPage}
        data-test-id={previousTestId}
        aria-label={intl.formatMessage({
          id: "/suM59",
          defaultMessage: "Previous page",
          description: "pagination previous page button aria label",
        })}
        icon={<ChevronLeft size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
      />
      <Button
        variant="secondary"
        size="small"
        type="button"
        disabled={!hasNextPage || disabled}
        onClick={onNextPage}
        data-test-id={nextTestId}
        aria-label={intl.formatMessage({
          id: "xEyXOV",
          defaultMessage: "Next page",
          description: "pagination next page button aria label",
        })}
        icon={<ChevronRight size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
      />
    </>
  );
};

PaginationButtons.displayName = "PaginationButtons";

export { PaginationButtons };
