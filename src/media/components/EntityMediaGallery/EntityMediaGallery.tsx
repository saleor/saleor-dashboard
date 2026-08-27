import { MediaDeleteDialog } from "@dashboard/components/MediaDeleteDialog/MediaDeleteDialog";
import { MediaGallery } from "@dashboard/components/MediaGallery/MediaGallery";
import { MediaUrlDialog } from "@dashboard/components/MediaUrlDialog/MediaUrlDialog";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { mediaMessages } from "@dashboard/media/messages";
import { type ReorderEvent } from "@dashboard/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { useIntl } from "react-intl";

import { type EntityMedia, type MediaOwnerTypename } from "../../types";
import { useEntityMediaMutations } from "../../useEntityMediaMutations";

interface EntityMediaGalleryProps {
  ownerId: string;
  ownerTypename: MediaOwnerTypename;
  /** Undefined while the owner query is still in flight. */
  media: EntityMedia[] | undefined;
  getMediaEditUrl?: (mediaId: string) => string;
}

export const EntityMediaGallery = ({
  ownerId,
  ownerTypename,
  media,
  getMediaEditUrl,
}: EntityMediaGalleryProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const { uploadFile, uploadUrl, deleteMedia, reorderMedia } = useEntityMediaMutations({
    ownerId,
    ownerTypename,
  });

  const notifyError = () =>
    notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });

  const handleReorder = ({ oldIndex, newIndex }: ReorderEvent) => {
    if (!media?.length || oldIndex === newIndex) {
      return;
    }

    if (oldIndex < 0 || newIndex < 0 || oldIndex >= media.length || newIndex >= media.length) {
      return;
    }

    reorderMedia(arrayMove([...media], oldIndex, newIndex)).then(
      errors =>
        errors.length === 0 &&
        notify({ status: "success", text: intl.formatMessage(mediaMessages.mediaReorderSuccess) }),
      notifyError,
    );
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      const failed = await deleteMedia(idsToDelete);

      if (failed > 0) {
        notifyError();
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(mediaMessages.mediaDeleteSuccess, {
            counter: idsToDelete.length,
          }),
        });
      }
    } finally {
      setDeleting(false);
      setIdsToDelete([]);
    }
  };

  const deletedMedia = idsToDelete.length === 1 ? media?.find(m => m.id === idsToDelete[0]) : null;

  return (
    <>
      <MediaGallery
        media={media}
        getImageEditUrl={getMediaEditUrl}
        onImageDelete={id => () => setIdsToDelete([id])}
        onImagesDelete={setIdsToDelete}
        onImageReorder={handleReorder}
        onImageUpload={uploadFile}
        onImagesUploadComplete={({ successCount, failureCount }) => {
          if (failureCount === 0) {
            notify({
              status: "success",
              text: intl.formatMessage(mediaMessages.mediaUploadSuccessCount, {
                count: successCount,
              }),
            });
          } else if (successCount === 0) {
            notify({
              status: "error",
              text: intl.formatMessage(mediaMessages.mediaUploadAllFailed, {
                count: failureCount,
              }),
            });
          } else {
            notify({
              status: "warning",
              text: intl.formatMessage(mediaMessages.mediaUploadPartial, {
                success: successCount,
                failed: failureCount,
              }),
            });
          }
        }}
        openMediaUrlModal={() => setUrlDialogOpen(true)}
      />
      <MediaUrlDialog
        open={urlDialogOpen}
        onClose={() => setUrlDialogOpen(false)}
        onSubmit={uploadUrl}
      />
      <MediaDeleteDialog
        open={idsToDelete.length > 0}
        quantity={idsToDelete.length}
        isVideo={deletedMedia?.mediaType === "VIDEO"}
        confirmButtonState={deleting ? "loading" : "default"}
        onClose={() => setIdsToDelete([])}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

EntityMediaGallery.displayName = "EntityMediaGallery";
