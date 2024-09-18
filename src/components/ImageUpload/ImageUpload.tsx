import { ImageIcon } from "@saleor/macaw-ui";
import { sprinkles, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl";

interface ImageUploadProps {
  children?: (props: { isDragActive: boolean }) => React.ReactNode;
  className?: string;
  disableClick?: boolean;
  isActiveClassName?: string;
  iconContainerClassName?: string;
  iconContainerActiveClassName?: string;
  hideUploadIcon?: boolean;
  onImageUpload: (files: FileList) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = props => {
  const {
    children,
    className,
    disableClick,
    iconContainerActiveClassName,
    iconContainerClassName,
    isActiveClassName,
    hideUploadIcon,
    onImageUpload,
  } = props;

  const handleDrop = (acceptedFiles: File[]) => {
    const fileList: FileList = {
      ...acceptedFiles,
      item: (index: number) => acceptedFiles[index] || null,
    };

    onImageUpload(fileList);
  };

  return (
    <Dropzone noClick={disableClick} onDrop={handleDrop}>
      {({ isDragActive, getInputProps, getRootProps }) => (
        <>
          <div
            {...getRootProps()}
            className={clsx(
              className,
              isActiveClassName && {
                [isActiveClassName]: isDragActive,
              },
              sprinkles({
                color: "default1",
                paddingY: 12,
                textAlign: "center",
                backgroundColor: isDragActive ? "default1Focused" : "default1",
              }),
            )}
          >
            {!hideUploadIcon && (
              <div
                className={clsx(
                  iconContainerClassName,
                  iconContainerActiveClassName && {
                    [iconContainerActiveClassName]: isDragActive,
                  },
                )}
              >
                <input {...getInputProps()} style={{ display: "none" }} accept="image/*" />
                <ImageIcon
                  className={sprinkles({
                    color: "default1",
                  })}
                  style={{ margin: "0 auto", width: "32px", height: "32px" }}
                />
                <Text display="block" fontWeight="bold" textTransform="uppercase" fontSize={3}>
                  <FormattedMessage
                    id="NxeDbG"
                    defaultMessage="Drop here to upload"
                    description="image upload"
                  />
                </Text>
              </div>
            )}
          </div>

          {children && children({ isDragActive })}
        </>
      )}
    </Dropzone>
  );
};
ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
