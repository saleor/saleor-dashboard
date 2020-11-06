interface PublicationData {
  publicationDate: string;
  isPublished: boolean;
}

function getPublicationData({
  publicationDate,
  isPublished
}: PublicationData): PublicationData {
  return {
    isPublished: !!publicationDate || isPublished,
    publicationDate: publicationDate || null
  };
}

export default getPublicationData;
