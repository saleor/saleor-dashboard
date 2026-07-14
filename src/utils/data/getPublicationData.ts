interface PublicationData {
  publishedAt: string | null;
  isPublished: boolean;
}

function getPublishedAt({ publishedAt, isPublished }: PublicationData): PublicationData {
  return {
    // A stored publication date implies the page should be published: Saleor
    // Core only reveals it to storefront visitors once the date passes, and an
    // isPublished=false + publishedAt combination would keep it hidden forever.
    isPublished: isPublished || Boolean(publishedAt),
    publishedAt: publishedAt || null,
  };
}

export default getPublishedAt;
