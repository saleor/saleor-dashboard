import { MediaDeleteDialog } from "@dashboard/components/MediaDeleteDialog/MediaDeleteDialog";
import { MediaDetailPage } from "@dashboard/components/MediaDetailPage/MediaDetailPage";
import { MediaMetadataDialog } from "@dashboard/components/MediaMetadataDialog/MediaMetadataDialog";
import { useMediaUpdateMutation } from "@dashboard/graphql/staging";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { mediaMessages } from "@dashboard/media/messages";
import { type DocumentNode } from "graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { type EntityMedia, type MediaOwnerTypename } from "../../types";
import { useEntityMediaMutations } from "../../useEntityMediaMutations";

interface EntityMediaDetailPageProps {
  ownerId: string;
  ownerTypename: MediaOwnerTypename;
  ownerName: string | undefined;
  ownerUrl: string;
  ownerIcon: JSX.Element;
  ownerListLabel: string;
  media: EntityMedia[] | undefined;
  mediaId: string;
  loading: boolean;
  /** Query re-run after metadata is saved. */
  refetchDocument: DocumentNode;
  getMediaUrl: (mediaId: string) => string;
}

export const EntityMediaDetailPage = ({
  ownerId,
  ownerTypename,
  ownerName,
  ownerUrl,
  ownerIcon,
  ownerListLabel,
  media,
  mediaId,
  loading,
  refetchDocument,
  getMediaUrl,
}: EntityMediaDetailPageProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { deleteMedia } = useEntityMediaMutations({ ownerId, ownerTypename });
  const [updateMedia, updateResult] = useMediaUpdateMutation({
    onCompleted: data => {
      if (data.mediaUpdate?.errors.length === 0) {
        notify({ status: "success", text: intl.formatMessage(mediaMessages.mediaUpdateSuccess) });
      }
    },
  });

  const mediaObj = media?.find(item => item.id === mediaId);

  const handleUpdate = async ({ alt }: { alt: string }) => {
    const result = await updateMedia({ variables: { id: mediaId, alt } });

    return result.data?.mediaUpdate?.errors ?? [];
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const failed = await deleteMedia([mediaId]);

      if (failed > 0) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });

        return;
      }

      navigate(ownerUrl);
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <MediaDetailPage
        ownerUrl={ownerUrl}
        ownerIcon={ownerIcon}
        ownerListLabel={ownerListLabel}
        ownerName={ownerName}
        disabled={loading}
        mediaObj={mediaObj ? { ...mediaObj, type: mediaObj.mediaType } : null}
        media={media}
        onDelete={() => setDeleteOpen(true)}
        onRowClick={id => () => navigate(getMediaUrl(id))}
        onShowMetadata={() => setMetadataOpen(true)}
        onSubmit={handleUpdate}
        saveButtonBarState={updateResult.status}
      />
      <MediaMetadataDialog
        open={metadataOpen && !!mediaObj}
        onClose={() => setMetadataOpen(false)}
        media={mediaObj}
        refetchDocument={refetchDocument}
      />
      <MediaDeleteDialog
        open={deleteOpen}
        quantity={1}
        isVideo={mediaObj?.mediaType === "VIDEO"}
        confirmButtonState={deleting ? "loading" : "default"}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

EntityMediaDetailPage.displayName = "EntityMediaDetailPage";
