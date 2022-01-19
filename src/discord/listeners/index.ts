import { Message } from 'discord.js';
import impSpottingListener from './impSpottingListener';

const listeners = [impSpottingListener];

export const handleMessageCreate = (message: Message) => {
  const validChannels = listeners.filter((listener) =>
    listener.channels.includes(message.channelId),
  );
  validChannels.forEach((channel) => channel.onChannelMessage(message));
};
