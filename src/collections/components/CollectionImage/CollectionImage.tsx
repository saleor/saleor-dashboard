import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import ImageTile from "@saleor/components/ImageTile";
import ImageUpload from "@saleor/components/ImageUpload";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import { CollectionDetails_collection_backgroundImage } from "../../types/CollectionDetails";

const styles = (theme: Theme) =>
  createStyles({
    PhotosIcon: {
      height: "64px",
      margin: "0 auto",
      width: "64px"
    },
    PhotosIconContainer: {
      margin: `${theme.spacing.unit * 5}px 0`,
      textAlign: "center"
    },
    fileField: {
      display: "none"
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing.unit,
      height: 148,
      justifySelf: "start",
      overflow: "hidden",
      padding: theme.spacing.unit * 2,
      position: "relative",
      width: 148
    }
  });

export interface CollectionImageProps {
  data: {
    backgroundImageAlt: string;
  };
  image: CollectionDetails_collection_backgroundImage;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

export const CollectionImage = withStyles(styles)(
  ({
    classes,
    data,
    onImageUpload,
    image,
    onChange,
    onImageDelete
  }: CollectionImageProps & WithStyles<typeof styles>) => {
    const anchor = React.useRef<HTMLInputElement>();
    const intl = useIntl();

    const handleImageUploadButtonClick = () => anchor.current.click();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Background Image (optional)",
            description: "section header"
          })}
          toolbar={
            <>
              <Button
                variant="text"
                color="primary"
                onClick={handleImageUploadButtonClick}
              >
                <FormattedMessage {...commonMessages.uploadImage} />
              </Button>
              <input
                className={classes.fileField}
                id="fileUpload"
                onChange={event => onImageUpload(event.target.files[0])}
                type="file"
                ref={anchor}
              />
            </>
          }
        />
        {image === undefined ? (
          <CardContent>
            <div>
              <div className={classes.imageContainer}>
                <Skeleton />
              </div>
            </div>
          </CardContent>
        ) : image === null ? (
          <ImageUpload onImageUpload={onImageUpload} />
        ) : (
          <CardContent>
            <ImageTile image={image} onImageDelete={onImageDelete} />
          </CardContent>
        )}
        {image && (
          <>
            <Hr />
            <CardContent>
              <TextField
                name="backgroundImageAlt"
                label={intl.formatMessage(commonMessages.description)}
                helperText={intl.formatMessage({
                  defaultMessage: "(Optional)",
                  description: "field is optional"
                })}
                value={data.backgroundImageAlt}
                onChange={onChange}
                fullWidth
                multiline
              />
            </CardContent>
          </>
        )}
      </Card>
    );
  }
);
CollectionImage.displayName = "CollectionImage";
export default CollectionImage;
