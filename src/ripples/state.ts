import { atom, useAtom } from "jotai";

const allRipplesModalOpen = atom(false);

export const useAllRipplesModalState = () => {
  const [isModalOpen, setState] = useAtom(allRipplesModalOpen);

  return {
    isModalOpen,
    setModalState(open: boolean) {
      setState(open);
    },
  };
};
