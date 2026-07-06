import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import { DashboardModal } from "@dashboard/components/Modal";
import { type ProductMediaFragment } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { areMediaSelectionsEqual } from "@dashboard/products/utils/handlers";
import { parseOembedData } from "@dashboard/products/utils/parseOembedData";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { productVariantMediaSelectDialogMessages as messages } from "./messages";
import styles from "./ProductVariantMediaSelectDialog.module.css";

interface ProductVariantMediaSelectDialogProps {
  media?: ProductMediaFragment[];
  selectedMedia?: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export const ProductVariantMediaSelectDialog = ({
  media,
  open,
  selectedMedia: initialMedia,
  onClose,
  onConfirm,
}: ProductVariantMediaSelectDialogProps) => {
  const committedMediaRef = useRef(initialMedia ?? []);

  committedMediaRef.current = initialMedia ?? [];

  const [selectedMedia, setSelectedMedia] = useState(initialMedia ?? []);

  useModalDialogOpen(open, {
    onOpen: () => setSelectedMedia(committedMediaRef.current),
    onClose: () => setSelectedMedia(committedMediaRef.current),
  });

  const sortedMedia = useMemo(
    () => [...(media ?? [])].sort((prev, next) => (prev.sortOrder ?? 0) - (next.sortOrder ?? 0)),
    [media],
  );

  const hasSelectionChanges = useMemo(
    () => !areMediaSelectionsEqual(selectedMedia, committedMediaRef.current),
    [selectedMedia, initialMedia],
  );

  const handleMediaSelect = (id: string) => {
    setSelectedMedia(current =>
      current.includes(id) ? current.filter(mediaId => mediaId !== id) : [...current, id],
    );
  };

  const handleConfirm = () => {
    if (hasSelectionChanges) {
      onConfirm(selectedMedia);
    }

    onClose();
  };

  const selectedCount = selectedMedia.length;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.ContextHeader
          description={<FormattedMessage {...messages.subtitle} />}
          contextLabel={
            sortedMedia.length > 0 ? (
              <FormattedMessage {...messages.selectedCount} values={{ count: selectedCount }} />
            ) : undefined
          }
        >
          <FormattedMessage {...messages.title} />
        </DashboardModal.ContextHeader>

        <DashboardModal.Body fill>
          <DashboardModal.Inset>
            {sortedMedia.length === 0 ? (
              <FormattedMessage {...messages.empty} />
            ) : (
              <div className={styles.grid}>
                {sortedMedia.map(mediaObj => {
                  const mediaUrl =
                    parseOembedData(mediaObj.oembedData).thumbnail_url || mediaObj.url;
                  const isSelected = selectedMedia.includes(mediaObj.id);

                  return (
                    <button
                      type="button"
                      className={clsx(styles.tile, isSelected && styles.tileSelected)}
                      onClick={() => handleMediaSelect(mediaObj.id)}
                      key={mediaObj.id}
                      data-test-id="variant-media-option"
                      aria-pressed={isSelected}
                    >
                      <MediaWithFallback
                        className={styles.image}
                        src={mediaUrl}
                        alt={mediaObj.alt ?? ""}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={!hasSelectionChanges}
            onClick={handleConfirm}
            transitionState="default"
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductVariantMediaSelectDialog.displayName = "ProductVariantMediaSelectDialog";
