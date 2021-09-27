import * as channels from "../requests/Channels";

export function deleteChannelsStartsWith(nameStartsWith) {
  channels.getChannels().then(resp => {
    const channelsArray = new Set(resp.body.data.channels);
    if (!channelsArray) {
      return;
    }
    channelsArray.forEach(element => {
      if (element.name.startsWith(nameStartsWith)) {
        const targetChannels = Array.from(channelsArray).filter(function(
          channelElement
        ) {
          return (
            element.currencyCode === channelElement.currencyCode &&
            element.id !== channelElement.id
          );
        });
        if (targetChannels[0]) {
          channels.deleteChannel(element.id, targetChannels[0].id);
          channelsArray.delete(element);
        }
      }
    });
  });
}
export function getDefaultChannel() {
  return channels.getChannels().then(resp => {
    const channelsArray = resp.body.data.channels;
    return channelsArray.find(function(channelElement) {
      return channelElement.slug === "default-channel";
    });
  });
}
