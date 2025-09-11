import { EmptyImage } from "@dashboard/components/EmptyImage";
import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedDate } from "react-intl";

export const Row = ({
  children,
  href,
  className,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <GridTable.Row
      __height="39px"
      backgroundColor={{
        hover: "default1Hovered",
      }}
      tabIndex={0}
      data-href={href}
      id={href}
      data-focus={false}
      className={className}
      onClick={onClick}
    >
      {children}
    </GridTable.Row>
  );
};

export const Thumbnail = ({ url, name }: { url?: string; name: string }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} height="100%">
      <Box borderColor="default1" borderWidth={1} borderRadius={2} borderStyle="solid">
        {!imageError ? (
          <>
            <Box
              as="img"
              src={url}
              alt={name}
              __width="31px"
              __height="31px"
              display={imageLoaded ? "block" : "none"}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && <Skeleton __width="31px" __height="31px" borderRadius={2} />}
          </>
        ) : (
          <EmptyImage />
        )}
      </Box>
    </Box>
  );
};

export const DisplayDate = ({ date }: { date: string }) => {
  return (
    <Text size={2} fontWeight="medium" textAlign="right" color="default2" paddingRight={6}>
      <FormattedDate value={date} year="numeric" month="long" day="2-digit" />
    </Text>
  );
};

export const LinkCell = ({ href, children }: { href: string; children?: React.ReactNode }) => {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "center", height: "100%" }}
      tabIndex={-1}
    >
      {children}
    </Link>
  );
};

export const TypeCell = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <GridTable.Cell __height="inherit" padding={0}>
      <LinkCell href={href}>
        <Text paddingLeft={6} paddingRight={3} size={2} fontWeight="medium" color="default2">
          {children}
        </Text>
      </LinkCell>
    </GridTable.Cell>
  );
};
