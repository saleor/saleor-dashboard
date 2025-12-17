import { useAtomValue } from "jotai";

import {
  closeModalActionAtom,
  isReferenceModalOpenAtom,
  referenceModalStateAtom,
  referenceSearchActionsAtom,
  referenceSearchResultsAtom,
} from "./atoms";
import { ReferenceModalState, ReferenceSearchActions, ReferenceSearchResults } from "./types";

export interface UseReferenceModalConsumerResult {
  isOpen: boolean;
  openAttributeId: string | null;
  initialConstraints: ReferenceModalState["initialConstraints"];
  searchResults: ReferenceSearchResults;
  searchActions: ReferenceSearchActions | null;
  closeModal: (() => void) | null;
}

export const useReferenceModalConsumer = (): UseReferenceModalConsumerResult => {
  const modalState = useAtomValue(referenceModalStateAtom);
  const searchResults = useAtomValue(referenceSearchResultsAtom);
  const searchActions = useAtomValue(referenceSearchActionsAtom);
  const isOpen = useAtomValue(isReferenceModalOpenAtom);
  const closeModal = useAtomValue(closeModalActionAtom);

  return {
    isOpen,
    openAttributeId: modalState.openAttributeId,
    initialConstraints: modalState.initialConstraints,
    searchResults,
    searchActions,
    closeModal,
  };
};
