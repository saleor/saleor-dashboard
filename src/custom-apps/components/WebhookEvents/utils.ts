type Actions = string[];

export const getWebhookTypes = (webhookEvents: string[]) => {
  const multiWords = ["DRAFT_ORDER", "GIFT_CARD", "ANY_EVENTS"];

  return webhookEvents.sort().reduce<Record<string, Actions>>((acc, key) => {
    const keywords = key.split("_");
    const multiKeyword = keywords.slice(0, 2).join("_");
    const [keyword, sliceSize] = multiWords.includes(multiKeyword)
      ? [multiKeyword, 2]
      : [keywords[0], 1];
    const event = keywords.slice(sliceSize).join("_");
    const events = acc[keyword] || [];

    events.push(event.length ? event : multiKeyword);
    acc[keyword] = events;

    return acc;
  }, {});
};
