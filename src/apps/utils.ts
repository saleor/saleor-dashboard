const tunnelKeywords = [".ngrok.io", ".saleor.live"];

export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(tunnelKeywords.find(keyword => manifestUrl.includes(keyword)));
