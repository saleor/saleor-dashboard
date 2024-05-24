interface PublicationData {
  publishedAt: string | null;
  isPublished: boolean;
}

function getPublishedAt({ publishedAt, isPublished }: PublicationData): PublicationData {
  return {
    isPublished,
    publishedAt: publishedAt || null,
  };
}

export default getPublishedAt;
