import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import Hr from "@dashboard/components/Hr";
import ImageUpload from "@dashboard/components/ImageUpload";
import MediaTile from "@dashboard/components/MediaTile";
import { CategoryDetailsFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, vars } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryUpdateData } from "../CategoryUpdatePage/form";

const useStyles = makeStyles(
  theme => ({
    fileField: {
      display: "none",
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    imageContainer: {
      background: "#ffffff",
      border: `1px solid ${vars.colors.border.default1}`,
      borderRadius: theme.spacing(),
      height: 148,
      justifySelf: "start",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 148,
    },
  }),
  { name: "CategoryBackground" },
);

export interface CategoryBackgroundProps {
  data: CategoryUpdateData;
  image: CategoryDetailsFragment["backgroundImage"] | undefined | null;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File | null) => void;
}

const CategoryBackground: React.FC<CategoryBackgroundProps> = props => {
  const classes = useStyles(props);
  const intl = useIntl();
  const anchor = React.useRef<HTMLInputElement>(null);
  const { data, onImageUpload, image, onChange, onImageDelete } = props;
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
          <Button variant="tertiary" onClick={handleImageUploadButtonClick}>
            <FormattedMessage {...commonMessages.uploadImage} />
          </Button>
          <input
            className={classes.fileField}
            id="fileUpload"
            onChange={({ target: { files } }) => onImageUpload(files && files[0])}
            type="file"
            ref={anchor}
            accept="image/*"
          />
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      {image === undefined ? (
        <DashboardCard.Content>
          <div>
            <div className={classes.imageContainer}>
              <Skeleton />
            </div>
          </div>
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
          <Hr />
          <DashboardCard.Content>
            <TextField
              name="backgroundImageAlt"
              label={intl.formatMessage(commonMessages.description)}
              helperText={intl.formatMessage({
                id: "0iMYc+",
                defaultMessage: "(Optional)",
                description: "field is optional",
              })}
              value={data.backgroundImageAlt}
              onChange={onChange}
              fullWidth
              multiline
            />
          </DashboardCard.Content>
        </>
      )}
    </DashboardCard>
  );
};

CategoryBackground.displayName = "CategoryBackground";
export default CategoryBackground;
