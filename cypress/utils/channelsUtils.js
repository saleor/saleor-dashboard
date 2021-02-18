import Channels from "../apiRequests/Channels";

class ChannelsUtils {
  channels = new Channels();
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
}
export default ChannelsUtils;
