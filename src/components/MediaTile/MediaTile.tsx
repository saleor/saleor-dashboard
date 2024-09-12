import { Box, Button, EditIcon, Spinner, TrashBinIcon } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

interface MediaTileBaseProps {
  media: {
    alt: string | null;
    url: string;
    type?: string;
    oembedData?: string;
  };
  draggable?: boolean;
  disableOverlay?: boolean;
  loading?: boolean;
  onDelete?: () => void;
  onEdit?: (event: React.ChangeEvent<any>) => void;
}

export type MediaTileProps = MediaTileBaseProps &
  (
    | {
        onEdit?: React.MouseEventHandler<HTMLButtonElement>;
        editHref?: never;
      }
    | {
        onEdit?: never;
        editHref?: string;
      }
  );

const MediaTile: React.FC<MediaTileProps> = props => {
  const {
    loading,
    onDelete,
    onEdit,
    editHref,
    media,
    disableOverlay = false,
    draggable = false,
  } = props;
  const parsedMediaOembedData = media?.oembedData ? JSON.parse(media.oembedData) : null;
  const mediaUrl = parsedMediaOembedData?.thumbnail_url || media.url;

  return (
    <Box
      className={clsx({
        ["show-on-hover"]: !disableOverlay,
      })}
      data-test-id="product-image"
      backgroundColor="default1"
      borderRadius={4}
      __width="150px"
      __height="150px"
      padding={1}
      position="relative"
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
    >
      <Box
        backgroundColor="default1"
        __opacity={0.8}
        borderRadius={4}
        position="absolute"
        left={0}
        top={0}
        __width="148px"
        __height="148px"
        display="none"
        className="show-on-hover"
        __cursor={draggable ? "move" : "default"}
      />
      <Box
        className="show-on-hover"
        position="absolute"
        left={0}
        top={0}
        __width="148px"
        __height="148px"
        display="none"
        __cursor={draggable ? "move" : "default"}
      >
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%" gap={2}>
            <Spinner />
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%" gap={2}>
            {(onEdit || editHref) && (
              <Button
                icon={<EditIcon />}
                variant="tertiary"
                {...(editHref ? { href: editHref, as: Link } : { onClick: onEdit })}
              />
            )}
            {onDelete && <Button icon={<TrashBinIcon />} variant="tertiary" onClick={onDelete} />}
          </Box>
        )}
      </Box>

      <Box
        as="img"
        height="100%"
        objectFit="contain"
        width="100%"
        style={{
          userSelect: "none",
        }}
        src={mediaUrl}
        alt={media.alt!}
      />
    </Box>
  );
};

MediaTile.displayName = "MediaTile";
export default MediaTile;
