import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Text, vars } from "@saleor/macaw-ui-next";
import { InfoIcon, LinkIcon, MessageSquareIcon, Pencil } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { DateTime } from "../Date";
import styles from "./TimelineNote.module.css";
import { TimelineNoteEdit } from "./TimelineNoteEdit";
import { Actor } from "./types";
import { getActorDisplayName, getActorLink, safeStringify } from "./utils";

interface TimelineNoteProps {
  date: string | React.ReactNode;
  message: string | null;
  actor?: Actor;
  hasPlainDate?: boolean;
  id?: string;
  relatedId?: string;
  onNoteUpdate?: (id: string, message: string) => Promise<unknown>;
  onNoteUpdateLoading?: boolean;
  eventData?: unknown;
  isLastInGroup?: boolean;
}

export const TimelineNote = ({
  date,
  message,
  hasPlainDate,
  actor,
  id,
  relatedId,
  onNoteUpdate,
  onNoteUpdateLoading,
  eventData,
  isLastInGroup,
}: TimelineNoteProps) => {
  const actorDisplayName = getActorDisplayName(actor);
  const actorLink = getActorLink(actor);
  const [showEdit, setShowEdit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const dateToRender =
    typeof date === "string" ? <DateTime date={date} plain={hasPlainDate} /> : date;

  const eventDataString = useMemo(() => {
    if (!eventData) return null;

    try {
      return safeStringify(eventData);
    } catch {
      return null;
    }
  }, [eventData]);

  const handleScrollToRelatedNote = useCallback(() => {
    if (!relatedId) return;

    const element = document.getElementById(`timeline-note-${relatedId}`);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });

    const card = element.querySelector("[data-note-card]") as HTMLElement;

    if (card) {
      card.classList.add(styles.noteCardHighlight);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        card.classList.remove(styles.noteCardHighlight);
      }, 2000); // Match CSS animation duration
    }
  }, [relatedId]);

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
              {actorLink ? (
                <Link to={actorLink} style={{ textDecoration: "none" }}>
                  <Text
                    size={3}
                    fontWeight="medium"
                    color="default2"
                    textDecoration={{ hover: "underline" }}
                  >
                    {actorDisplayName}
                  </Text>
                </Link>
              ) : (
                <Text size={3} fontWeight="medium" color="default2">
                  {actorDisplayName}
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
                    onClick={handleScrollToRelatedNote}
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
                {dateToRender}
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
