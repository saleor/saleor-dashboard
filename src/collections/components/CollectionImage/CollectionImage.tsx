import { DashboardCard } from "@dashboard/components/Card";
import ImageUpload from "@dashboard/components/ImageUpload";
import MediaTile from "@dashboard/components/MediaTile";
import { CollectionDetailsFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button, Divider, Skeleton, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface CollectionImageProps {
  data: {
    backgroundImageAlt: string;
  };
  image: CollectionDetailsFragment["backgroundImage"];
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

export const CollectionImage: React.FC<CollectionImageProps> = props => {
  const { data, onImageUpload, image, onChange, onImageDelete } = props;
  const anchor = React.useRef<HTMLInputElement | null>(null);
  const intl = useIntl();
  const handleImageUploadButtonClick = () => anchor.current?.click();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "DP6b8U",
            defaultMessage: "Background Image (optional)",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            variant="secondary"
            onClick={handleImageUploadButtonClick}
            data-test-id="upload-image-button"
          >
            <FormattedMessage {...commonMessages.uploadImage} />
          </Button>
          <input
            style={{ display: "none" }}
            id="fileUpload"
            onChange={event => event.target.files && onImageUpload(event.target.files[0])}
            type="file"
            ref={anchor}
            accept="image/*"
          />
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      {image === undefined ? (
        <DashboardCard.Content>
          <Box
            backgroundColor="default1"
            borderStyle="solid"
            borderWidth={1}
            borderColor="default1"
            __height="150px"
            __width="150px"
            padding={2}
            position="relative"
            justifySelf="start"
            overflow="hidden"
            borderRadius={4}
          >
            <Skeleton height="100%" />
          </Box>
        </DashboardCard.Content>
      ) : image === null ? (
        <ImageUpload onImageUpload={files => onImageUpload(files[0])} />
      ) : (
        <DashboardCard.Content>
          <MediaTile media={image} onDelete={onImageDelete} />
        </DashboardCard.Content>
      )}
      {image && (
        <>
          <Divider />

          <DashboardCard.Content>
            <Textarea
              name="backgroundImageAlt"
              label={intl.formatMessage(commonMessages.description)}
              helperText={intl.formatMessage({
                id: "0iMYc+",
                defaultMessage: "(Optional)",
                description: "field is optional",
              })}
              value={data.backgroundImageAlt}
              onChange={onChange}
              width="100%"
              rows={2}
            />
          </DashboardCard.Content>
        </>
      )}
    </DashboardCard>
  );
};

CollectionImage.displayName = "CollectionImage";
export default CollectionImage;
