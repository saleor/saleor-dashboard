import { atom } from "jotai";

import { ReferenceModalState, ReferenceSearchActions, ReferenceSearchResults } from "./types";

const initialModalState: ReferenceModalState = {
  openAttributeId: null,
  initialConstraints: undefined,
};

const initialSearchResults: ReferenceSearchResults = {
  pages: [],
  products: [],
  categories: [],
  collections: [],
};

export const referenceModalStateAtom = atom(initialModalState);

export const referenceSearchResultsAtom = atom(initialSearchResults);

// Simple primitive atom - null initially
export const referenceSearchActionsAtom = atom<
  ReferenceSearchActions | null,
  [ReferenceSearchActions | null],
  void
>(null, (_get, set, update) => set(referenceSearchActionsAtom, update));

// Action atom for closing modal - set by main hook, used by consumers
type CloseModalAction = (() => void) | null;
export const closeModalActionAtom = atom<CloseModalAction, [CloseModalAction], void>(
  null,
  (_get, set, update) => set(closeModalActionAtom, update),
);

export const isReferenceModalOpenAtom = atom(
  get => get(referenceModalStateAtom).openAttributeId !== null,
);
