import Channels from "../apiRequests/Channels";

class ChannelsUtils {
  channels = new Channels();
  createdChannel;

  deleteChannels(nameStartsWith) {
    this.channels.getChannels().then(resp => {
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
            this.channels.deleteChannel(element.id, targetChannels[0].id);
            channelsArray.delete(element);
          }
        }
      });
    });
  }
  getDefaultChannel() {
    return this.channels.getChannels().then(resp => {
      const channelsArray = resp.body.data.channels;
      return (this.defaultChannel = channelsArray.find(function(
        channelElement
      ) {
        return channelElement.slug === "default-channel";
      }));
    });
  }
  createChannel({ isActive = true, name, slug = name, currencyCode = "PLN" }) {
    return this.channels
      .createChannel(isActive, name, slug, currencyCode)
      .then(
        resp => (this.createdChannel = resp.body.data.channelCreate.channel)
      );
  }
  getCreatedChannel() {
    return this.createdChannel;
  }
}
export default ChannelsUtils;
