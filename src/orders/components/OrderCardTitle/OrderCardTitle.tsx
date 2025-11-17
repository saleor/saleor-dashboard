import DefaultCardTitle from "@dashboard/components/CardTitle";
import { FulfillmentStatus } from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Box, Button, Sprinkles, sprinkles, Text, TextProps } from "@saleor/macaw-ui-next";
import {
  CheckIcon,
  CopyIcon,
  EraserIcon,
  PackageIcon,
  ReplaceIcon,
  SignatureIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { Link, LinkProps } from "react-router-dom";

import { getOrderTitleMessage } from "./utils";

export type CardTitleStatus = FulfillmentStatus | "unfulfilled";

interface OrderCardTitleProps {
  fulfillmentOrder?: number;
  status: CardTitleStatus;
  toolbar?: React.ReactNode;
  orderNumber?: string;
  warehouseName?: string;
  withStatus?: boolean;
  createdDate?: string;
  className?: string;
  trackingNumber?: string;
  warehouseId?: string;
}

const getIndicatorBasedOnStatus = (status: CardTitleStatus): ReactNode => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color="hsla(152, 98%, 44%, 1)" size={17} />;
    case FulfillmentStatus.REFUNDED:
      return (
        <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.49998 14.25H3.16665C2.74672 14.25 2.34399 14.0832 2.04706 13.7863C1.75013 13.4893 1.58331 13.0866 1.58331 12.6667V6.33333C1.58331 5.91341 1.75013 5.51068 2.04706 5.21375C2.34399 4.91681 2.74672 4.75 3.16665 4.75H15.8333C16.2532 4.75 16.656 4.91681 16.9529 5.21375C17.2498 5.51068 17.4166 5.91341 17.4166 6.33333V10.2917"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 9.5H14.2579"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4167 15.0416L12.6667 15.0416"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.75 9.5H4.75792"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.50002 11.0833C10.3745 11.0833 11.0834 10.3744 11.0834 9.49996C11.0834 8.62551 10.3745 7.91663 9.50002 7.91663C8.62557 7.91663 7.91669 8.62551 7.91669 9.49996C7.91669 10.3744 8.62557 11.0833 9.50002 11.0833Z"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case FulfillmentStatus.RETURNED:
      return (
        <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.49998 14.25H3.16665C2.74672 14.25 2.34399 14.0832 2.04706 13.7863C1.75013 13.4893 1.58331 13.0866 1.58331 12.6667V6.33333C1.58331 5.91341 1.75013 5.51068 2.04706 5.21375C2.34399 4.91681 2.74672 4.75 3.16665 4.75H15.8333C16.2532 4.75 16.656 4.91681 16.9529 5.21375C17.2498 5.51068 17.4166 5.91341 17.4166 6.33333V10.2917"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 9.5H14.2579"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4167 15.0416L12.6667 15.0416"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.75 9.5H4.75792"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.50002 11.0833C10.3745 11.0833 11.0834 10.3744 11.0834 9.49996C11.0834 8.62551 10.3745 7.91663 9.50002 7.91663C8.62557 7.91663 7.91669 8.62551 7.91669 9.49996C7.91669 10.3744 8.62557 11.0833 9.50002 11.0833Z"
            stroke="#252828"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case FulfillmentStatus.CANCELED:
      return <EraserIcon color="hsl(0.058, 99.8%, 70.6%)" size={17} />;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return (
        <>
          {/*           <OrderFulfillmentRefundedStatusIcon size={17} />
           */}
          <ReplaceIcon size={17} />
        </>
      );
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon size={17} />;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return <SignatureIcon size={17} />;
    default:
      return null;
  }
};

interface ClipboardCopyIconProps extends Sprinkles {
  hasBeenClicked: boolean;
}

export const ClipboardCopyIcon = ({ hasBeenClicked, ...sprinkleProps }: ClipboardCopyIconProps) => {
  const className = sprinkles({ color: "default2" });

  return hasBeenClicked ? (
    <CheckIcon size={16} className={className} />
  ) : (
    <CopyIcon size={16} className={className} />
  );
};

interface UnderlineLinkProps extends LinkProps {
  textProps?: Omit<TextProps, "children">;
}

export const UnderlineLink = ({ children, textProps, ...props }: UnderlineLinkProps) => (
  <Link {...props}>
    <UnderlineText {...textProps}>{children}</UnderlineText>
  </Link>
);

// TODO: move to MacawUI
const UnderlineText = ({ children, ...props }: TextProps) => (
  <Text
    as="span"
    textDecoration="underline"
    fontWeight="medium"
    size={2}
    data-macaw-ui-candidate
    {...props}
  >
    {children}
  </Text>
);

const OrderCardTitle = ({
  status,
  warehouseName,
  withStatus = false,
  toolbar,
  createdDate,
  className,
  trackingNumber,
  warehouseId,
}: OrderCardTitleProps) => {
  const intl = useIntl();
  const messageForStatus = getOrderTitleMessage(status);
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      className={className}
      title={
        <Box>
          <Box display={"flex"} alignItems={"center"}>
            {warehouseName && (
              <Text color="default2" size={2} marginRight={1}>
                {intl.formatMessage(
                  {
                    defaultMessage: "From {warehouseName}: {fulfillmentDate}",
                    id: "XRQiGd",
                  },
                  {
                    warehouseName: (
                      <UnderlineLink to={warehouseUrl(warehouseId)}>{warehouseName}</UnderlineLink>
                    ),
                    fulfillmentDate: intl.formatDate(createdDate, {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                )}
              </Text>
            )}
            {trackingNumber && (
              <>
                <Text color="default2" size={2} marginRight={1}>
                  |
                </Text>
                <Text
                  color="default2"
                  size={2}
                  onMouseEnter={() => setShowCopyButton(true)}
                  onMouseLeave={() => setShowCopyButton(false)}
                  cursor="pointer"
                  onClick={() => copy(trackingNumber)}
                >
                  {intl.formatMessage(
                    {
                      defaultMessage: "Tracking: {trackingNumber}",
                      id: "vMo6/3",
                    },
                    {
                      trackingNumber: (
                        <Text size={2} color="default1" fontWeight="medium">
                          {trackingNumber}
                        </Text>
                      ),
                    },
                  )}
                </Text>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ClipboardCopyIcon hasBeenClicked={copied} />}
                  onClick={() => copy(trackingNumber)}
                  className={sprinkles({
                    opacity: showCopyButton ? "1" : "0",
                  })}
                />
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <Text size={6} fontWeight="medium">
              {intl.formatMessage(messageForStatus)}
            </Text>
            {withStatus && (
              <Box marginLeft={2} display={"flex"} placeItems={"center"}>
                {getIndicatorBasedOnStatus(status)}
              </Box>
            )}
          </Box>
        </Box>
      }
    />
  );
};

// TODO: remove
OrderCardTitle.displayName = "OrderCardTitle";
export default OrderCardTitle;
