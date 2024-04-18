import { Announcements, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction } from "react";

import {
  CurrentPosition,
  DataTypePlaceholder,
  FlattenedItem,
  Projected,
  TreeItems,
} from "../types";
import { flattenTree } from "../utils";

interface UseAnnouncementProps<T extends DataTypePlaceholder> {
  items: TreeItems<T>;
  projected: Projected | null;
  currentPosition: CurrentPosition | null;
  setCurrentPosition: Dispatch<SetStateAction<CurrentPosition | null>>;
}

export const useAnnouncement = <T extends DataTypePlaceholder>({
  projected,
  currentPosition,
  setCurrentPosition,
  items,
}: UseAnnouncementProps<T>) => {
  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
    if (overId && projected) {
      if (eventName !== "onDragEnd") {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: Array<FlattenedItem<T>> = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
      const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else if (projected.depth > previousItem.depth) {
        announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
      } else {
        const previousSibling = findPreviousSibling(projected, previousItem, sortedItems);
        if (previousSibling) {
          announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
        }
      }

      return announcement;
    }
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement("onDragMove", active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement("onDragOver", active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement("onDragEnd", active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return announcements;
};

function findPreviousSibling<T extends DataTypePlaceholder>(
  projected: Projected,
  previousItem: FlattenedItem<T>,
  sortedItems: Array<FlattenedItem<T>>,
): FlattenedItem<T> | undefined {
  let previousSibling: FlattenedItem<T> | undefined = previousItem;
  while (previousSibling && projected.depth < previousSibling.depth) {
    const parentId: UniqueIdentifier | null = previousSibling.parentId;
    previousSibling = sortedItems.find(({ id }) => id === parentId);
  }
  return previousSibling;
}
