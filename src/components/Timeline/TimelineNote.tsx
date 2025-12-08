import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { GiftCardDetailsQuery, OrderEventFragment } from "@dashboard/graphql";
import { getUserName } from "@dashboard/misc";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Box, Button, Text, vars } from "@saleor/macaw-ui-next";
import { InfoIcon, LinkIcon, MessageSquareIcon, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { DateTime } from "../Date";
import { TimelineNoteEdit } from "./TimelineNoteEdit";
import { safeStringify } from "./utils";

type TimelineAppType =
  | NonNullable<GiftCardDetailsQuery["giftCard"]>["events"][0]["app"]
  | OrderEventFragment["app"];

interface TimelineNoteProps {
  date: string;
  message: string | null;
  user: OrderEventFragment["user"];
  app: TimelineAppType;
  hasPlainDate?: boolean;
  id?: string;
  relatedId?: string;
  onNoteUpdate?: (id: string, message: string) => Promise<unknown>;
  onNoteUpdateLoading?: boolean;
  dateNode?: React.ReactNode;
  eventData?: unknown;
  isLastInGroup?: boolean;
}

export const TimelineNote = ({
  date,
  user,
  message,
  hasPlainDate,
  app,
  id,
  relatedId,
  onNoteUpdate,
  onNoteUpdateLoading,
  dateNode,
  eventData,
  isLastInGroup,
}: TimelineNoteProps) => {
  const userDisplayName = getUserName(user, true) ?? app?.name;
  const [showEdit, setShowEdit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const eventDataString = useMemo(() => {
    if (!eventData) return null;

    try {
      return safeStringify(eventData);
    } catch {
      return null;
    }
  }, [eventData]);

  return (
    <Box
      display="flex"
      width="100%"
      position="relative"
      id={id ? `timeline-note-${id}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vertical connecting line - hidden for last item in group */}
      {!isLastInGroup && (
        <Box
          position="absolute"
          __left="19px"
          __top="32px"
          __bottom="-20px"
          __width="1px"
          backgroundColor="default1Hovered"
        />
      )}

      <Box display="flex" gap={2} marginBottom={5} width="100%">
        {/* Left icon column - comment bubble icon */}
        <Box
          width={10}
          display="flex"
          justifyContent="center"
          flexShrink="0"
          paddingTop={1}
          position="relative"
          __zIndex="1"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="100%"
            backgroundColor="default1"
            borderColor="default1"
            borderStyle="solid"
            borderWidth={1}
            __width="32px"
            __height="32px"
          >
            <MessageSquareIcon size={16} color={vars.colors.text.default2} />
          </Box>
        </Box>

        {/* Card content */}
        <Box
          width="100%"
          backgroundColor="default1"
          borderRadius={4}
          borderStyle="solid"
          borderWidth={1}
          borderColor="default1"
          padding={4}
          data-note-card
          style={{
            transition: "border-color 0.3s ease",
          }}
        >
          {/* Header row with name, info icon, date */}
          <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              {user ? (
                <Link to={staffMemberDetailsUrl(user.id)} style={{ textDecoration: "none" }}>
                  <Text
                    size={3}
                    fontWeight="medium"
                    color="default2"
                    textDecoration={{ hover: "underline" }}
                  >
                    {userDisplayName}
                  </Text>
                </Link>
              ) : (
                <Text size={3} fontWeight="medium" color="default2">
                  {userDisplayName}
                </Text>
              )}
              <Text size={2} color="default2" whiteSpace="nowrap">
                {relatedId ? (
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    cursor="pointer"
                    onClick={() => {
                      const element = document.getElementById(`timeline-note-${relatedId}`);

                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });

                        const card = element.querySelector("[data-note-card]") as HTMLElement;

                        if (card) {
                          card.style.borderColor = "hsla(0, 0%, 0%, 0.3)";
                          setTimeout(() => {
                            card.style.borderColor = "";
                          }, 2000);
                        }
                      }
                    }}
                  >
                    <FormattedMessage defaultMessage="edited" id="Zx1w1e" />
                    <LinkIcon size={12} />
                  </Box>
                ) : (
                  <FormattedMessage defaultMessage="added" id="xJEaxW" />
                )}
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              {eventDataString && (
                <Box
                  as="span"
                  title={eventDataString}
                  cursor="pointer"
                  display="inline-flex"
                  alignItems="center"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <InfoIcon size={16} color={vars.colors.text.default2} />
                </Box>
              )}
              <Text size={2} color="default2" whiteSpace="nowrap">
                {dateNode || <DateTime date={date} plain={hasPlainDate} />}
              </Text>
            </Box>
          </Box>

          {/* Message content */}
          {showEdit && id ? (
            <TimelineNoteEdit
              id={id}
              note={message!}
              onSubmit={onNoteUpdate!}
              loading={onNoteUpdateLoading!}
              onCancel={() => setShowEdit(false)}
            />
          ) : (
            <Box display="flex" justifyContent="space-between" gap={3} wordBreak="break-all">
              <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
              {onNoteUpdate && (
                <Box
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <Button
                    data-test-id="edit-note"
                    variant="tertiary"
                    size="small"
                    onClick={() => setShowEdit(true)}
                    icon={
                      <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
TimelineNote.displayName = "TimelineNote";
