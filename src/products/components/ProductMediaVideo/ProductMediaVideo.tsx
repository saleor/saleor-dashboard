import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  {
    iframe: {
      height: "100%",
      left: 0,
      position: "absolute",
      top: 0,
      width: "100%"
    },
    overlay: {
      background: "transparent",
      cursor: "pointer",
      height: "140px",
      left: "50%",
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: "140px"
    },
    videoWrapper: {
      height: "0",
      paddingBottom: "56.25%",
      position: "relative",
      width: "100%"
    }
  },
  { name: "ProductMediaVideo" }
);

interface ProductMediaVideoProps {
  className: string;
  video: {
    url: string;
    type?: string;
    alt?: string;
  };
  fullWidth?: boolean;
  withOverlay?: boolean;
}

export const ProductMediaVideo: React.FC<ProductMediaVideoProps> = props => {
  const { video, fullWidth, className, withOverlay } = props;
  const styles = useStyles(props);

  return (
    <div className={classNames({ [styles.videoWrapper]: fullWidth })}>
      {withOverlay && <div className={styles.overlay} />}
      <iframe
        className={classNames(className, { [styles.iframe]: fullWidth })}
        title={video.alt}
        src={video.url}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};
ProductMediaVideo.displayName = "ProductMediaVideo";
export default ProductMediaVideo;
