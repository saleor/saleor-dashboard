import useRouter from "use-react-router";

export const useCollectionId = () => {
  const {
    match: {
      params: { id: collectionId },
    },
  } = useRouter<{ id: string }>();

  return decodeURIComponent(collectionId);
};
