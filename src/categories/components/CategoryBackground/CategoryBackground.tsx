import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import ImageTile from "@saleor/components/ImageTile";
import ImageUpload from "@saleor/components/ImageUpload";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import { FormattedMessage, useIntl } from "react-intl";
import { CategoryDetails_category_backgroundImage } from "../../types/CategoryDetails";
import { FormData } from "../CategoryUpdatePage";

const useStyles = makeStyles((theme: Theme) => ({
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
}));

export interface CategoryBackgroundProps {
  data: FormData;
  image: CategoryDetails_category_backgroundImage;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

const CategoryBackground: React.FC<CategoryBackgroundProps> = props => {
  const classes = useStyles(props);
  const intl = useIntl();
  const anchor = React.useRef<HTMLInputElement>();

  const { data, onImageUpload, image, onChange, onImageDelete } = props;

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
};
CategoryBackground.displayName = "CategoryBackground";
export default CategoryBackground;
