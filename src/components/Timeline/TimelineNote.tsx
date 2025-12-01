import { GiftCardDetailsQuery, OrderEventFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Button, EditIcon, Text, vars } from "@saleor/macaw-ui-next";
import { InfoIcon, LinkIcon, MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { DashboardCard } from "../Card";
import { DateTime } from "../Date";
import { UserAvatar } from "../UserAvatar";
import { TimelineNoteEdit } from "./TimelineNoteEdit";

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

const TimelineAvatar = ({
  user,
  app,
}: {
  user: OrderEventFragment["user"];
  app: TimelineAppType;
}) => {
  if (user) {
    return <UserAvatar initials={getUserInitials(user)} url={user?.avatar?.url} size="small" />;
  }

  if (app) {
    return (
      <UserAvatar initials={app.name?.slice(0, 2)} url={app.brand?.logo?.default} size="small" />
    );
  }

  return null;
};

const safeStringify = (data: any): string => {
  if (!data) return "";

  try {
    const seen = new WeakSet();

    return JSON.stringify(
      data,
      (key, value) => {
        if (key === "__typename") return undefined;

        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";

          seen.add(value);
        }

        return value;
      },
      2,
    );
  } catch {
    return "Unable to serialize";
  }
};

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

  const infoIcon = eventData ? (
    <span
      title={safeStringify(eventData)}
      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
    >
      <InfoIcon size={16} color="hsla(0, 0%, 0%, 0.4)" />
    </span>
  ) : null;

  return (
    <Box display="flex" width="100%" position="relative">
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
        <DashboardCard width="100%" backgroundColor="default1">
          <DashboardCard.Content
            borderRadius={2}
            borderStyle="solid"
            borderWidth={1}
            borderColor="default1"
            padding={4}
          >
            {/* Header row with avatar, name, date, info icon */}
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <TimelineAvatar user={user} app={app} />
                <Text size={3} fontWeight="medium">
                  {userDisplayName}
                </Text>
                <Text size={2} color="default2" display="flex" gap={1} whiteSpace="nowrap">
                  {relatedId ? (
                    <FormattedMessage defaultMessage="edited" id="Zx1w1e" />
                  ) : (
                    <FormattedMessage defaultMessage="added" id="xJEaxW" />
                  )}
                  {dateNode || <DateTime date={date} plain={hasPlainDate} />}
                </Text>
              </Box>
              {infoIcon}
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

                {/* Edit link for edited notes */}
                {relatedId && (
                  <Box marginTop={3} display="flex" alignItems="center" gap={1}>
                    <LinkIcon size={14} color="hsla(0, 0%, 0%, 0.4)" />
                    <Text size={2} color="default2">
                      <FormattedMessage
                        defaultMessage="Edit of {userName}'s comment"
                        id="4vU2Q7"
                        values={{ userName: userDisplayName }}
                      />
                    </Text>
                  </Box>
                )}
              </>
            )}
          </DashboardCard.Content>
        </DashboardCard>
      </Box>
    </Box>
  );
};
TimelineNote.displayName = "TimelineNote";
