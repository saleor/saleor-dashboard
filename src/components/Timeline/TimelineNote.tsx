import { GiftCardDetailsQuery, OrderEventFragment } from "@dashboard/graphql";
import { getUserName } from "@dashboard/misc";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Box, Button, EditIcon, Text, vars } from "@saleor/macaw-ui-next";
import { InfoIcon, LinkIcon, MessageSquareIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { DateTime } from "../Date";
import { TimelineNoteEdit } from "./TimelineNoteEdit";
import { safeStringify } from "./utils";

// CSS for hover effect
const noteCardStyles = `
  .timeline-note-card:hover {
    background-color: ${vars.colors.background.default2};
  }
  .timeline-note-row .timeline-info-icon {
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }
  .timeline-note-row:hover .timeline-info-icon {
    opacity: 1;
  }
  .timeline-note-card .timeline-edit-button {
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }
  .timeline-note-card:hover .timeline-edit-button {
    opacity: 1;
  }
  .timeline-edit-link,
  .timeline-user-link {
    text-decoration: none;
  }
  .timeline-edit-link:hover,
  .timeline-user-link:hover,
  .timeline-edit-link:hover span,
  .timeline-user-link:hover span {
    text-decoration: underline;
  }
`;

// Inject styles once
if (typeof document !== "undefined") {
  const styleId = "timeline-note-styles-v5";

  // Remove old styles if exist
  [
    "timeline-note-styles",
    "timeline-note-styles-v2",
    "timeline-note-styles-v3",
    "timeline-note-styles-v4",
  ].forEach(id => {
    const oldStyle = document.getElementById(id);

    if (oldStyle) {
      oldStyle.remove();
    }
  });

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");

    style.id = styleId;
    style.textContent = noteCardStyles;
    document.head.appendChild(style);
  }
}

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
  eventData?: any;
  isLastInGroup?: boolean;
}

interface NoteMessageProps {
  message: string | null;
}

const NoteMessage = ({ message }: NoteMessageProps) => (
  <>
    {message?.split("\n").map((string, index) => {
      if (string === "") {
        return <br key={`break-${index}`} />;
      }

      return <Text key={`note-${index}`}>{string}</Text>;
    })}
  </>
);

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

  const eventDataString = useMemo(() => {
    if (!eventData) return null;

    try {
      return safeStringify(eventData);
    } catch {
      return null;
    }
  }, [eventData]);

  const infoIcon = eventDataString ? (
    <span
      className="timeline-info-icon"
      title={eventDataString}
      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
    >
      <InfoIcon size={16} color={vars.colors.text.default2} />
    </span>
  ) : null;

  return (
    <Box
      display="flex"
      width="100%"
      position="relative"
      className="timeline-note-row"
      id={id ? `timeline-note-${id}` : undefined}
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
          className="timeline-note-card"
          style={{
            transition: "background-color 0.15s ease-in-out",
          }}
        >
          {/* Header row with name, info icon, date */}
          <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              {user ? (
                <Link to={staffMemberDetailsUrl(user.id)} className="timeline-user-link">
                  <Text size={3} fontWeight="medium" color="default2">
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
                    className="timeline-edit-link"
                    onClick={() => {
                      const element = document.getElementById(`timeline-note-${relatedId}`);

                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });

                        const card = element.querySelector(".timeline-note-card") as HTMLElement;

                        if (card) {
                          card.style.transition = "border-color 0.3s ease";
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
              {infoIcon}
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
            <>
              <Box display="flex" justifyContent="space-between" gap={3} wordBreak="break-all">
                <NoteMessage message={message} />
                {onNoteUpdate && (
                  <Button
                    className="timeline-edit-button"
                    data-test-id="edit-note"
                    variant="tertiary"
                    size="small"
                    onClick={() => {
                      setShowEdit(true);
                    }}
                    icon={<EditIcon size="small" />}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
TimelineNote.displayName = "TimelineNote";
