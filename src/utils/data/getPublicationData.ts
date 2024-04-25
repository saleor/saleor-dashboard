interface PublicationData {
  publicationDate: string | null;
  isPublished: boolean;
}

function getPublicationData({ publicationDate, isPublished }: PublicationData): PublicationData {
  return {
    isPublished,
    publicationDate: publicationDate || null,
  };
}

export default getPublicationData;
