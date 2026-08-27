import { type Reference, type StoreObject } from "@apollo/client";
import {
  type MediaReorderMutation,
  useMediaCreateMutation,
  useMediaDeleteMutation,
  useMediaReorderMutation,
} from "@dashboard/graphql/staging";

import { type EntityMedia, type MediaOwnerTypename } from "./types";

interface UseEntityMediaMutationsProps {
  ownerId: string;
  ownerTypename: MediaOwnerTypename;
}

/**
 * `mediaCreate`/`mediaDelete`/`mediaReorder` return the media alone, so the owner's `media`
 * list is patched by hand instead of being refetched after every upload.
 */
export const useEntityMediaMutations = ({
  ownerId,
  ownerTypename,
}: UseEntityMediaMutationsProps) => {
  const [createMedia] = useMediaCreateMutation();
  const [deleteMediaItem] = useMediaDeleteMutation();
  const [reorderMediaItems] = useMediaReorderMutation();

  const ownerRef: StoreObject = { __typename: ownerTypename, id: ownerId };

  const uploadFile = async (file: File): Promise<string | undefined> => {
    const result = await createMedia({
      variables: { id: ownerId, alt: "", image: file },
      update: (cache, { data }) => {
        const created = data?.mediaCreate?.media;

        if (!created) {
          return;
        }

        cache.modify({
          id: cache.identify(ownerRef),
          fields: {
            media: (existing: Reference[] = [], { toReference }) => [
              ...existing,
              toReference(created, true),
            ],
          },
        });
      },
    });

    if (result.data?.mediaCreate?.errors.length || !result.data?.mediaCreate?.media) {
      throw new Error("Failed to upload media");
    }

    return result.data.mediaCreate.media.id;
  };

  const uploadUrl = async (mediaUrl: string) => {
    const result = await createMedia({
      variables: { id: ownerId, alt: "", mediaUrl },
      update: (cache, { data }) => {
        const created = data?.mediaCreate?.media;

        if (!created) {
          return;
        }

        cache.modify({
          id: cache.identify(ownerRef),
          fields: {
            media: (existing: Reference[] = [], { toReference }) => [
              ...existing,
              toReference(created, true),
            ],
          },
        });
      },
    });

    return result.data?.mediaCreate?.errors ?? [];
  };

  /** Resolves with the number of items that could not be deleted. */
  const deleteMedia = async (ids: string[]): Promise<number> => {
    const results = await Promise.all(
      ids.map(id =>
        deleteMediaItem({
          variables: { id },
          update: cache => {
            cache.modify({
              id: cache.identify(ownerRef),
              fields: {
                media: (existing: Reference[] = [], { readField }) =>
                  existing.filter(ref => readField("id", ref) !== id),
              },
            });
          },
        }).then(
          result => result.data?.mediaDelete?.errors.length === 0,
          () => false,
        ),
      ),
    );

    return results.filter(succeeded => !succeeded).length;
  };

  const reorderMedia = async (ordered: EntityMedia[]) => {
    const optimisticMedia: MediaReorderMutation["mediaReorder"] = {
      __typename: "MediaReorder",
      errors: [],
      media: ordered,
    };
    const result = await reorderMediaItems({
      variables: { id: ownerId, mediaIds: ordered.map(item => item.id) },
      optimisticResponse: { __typename: "Mutation", mediaReorder: optimisticMedia },
      update: (cache, { data }) => {
        const reordered = data?.mediaReorder?.media;

        if (!reordered) {
          return;
        }

        cache.modify({
          id: cache.identify(ownerRef),
          fields: {
            media: (_existing, { toReference }) =>
              reordered.map(item => toReference(item, true)).filter(Boolean),
          },
        });
      },
    });

    return result.data?.mediaReorder?.errors ?? [];
  };

  return { uploadFile, uploadUrl, deleteMedia, reorderMedia };
};
