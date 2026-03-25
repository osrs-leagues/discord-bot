import { Message, MessageReaction, User} from 'discord.js';
import impSpottingListener from './messageListeners/impSpottingListener';
import challengeApprovalMessageListener from './messageListeners/challengeApprovalListener';
import pregnantManReactionListener from './reactionListeners/pregnantManReactionListener';

const messageListeners = [
  impSpottingListener,
  challengeApprovalMessageListener,
];

const reactionListeners = [
  pregnantManReactionListener,
]

export const handleMessageCreate = (message: Message) => {
  const validChannels = messageListeners.filter((listener) =>
    listener.channels.includes(message.channelId),
  );
  validChannels.forEach((channel) => channel.onChannelMessage(message));
};

export const handleReactionAdd = async (reaction: MessageReaction, user: User) => {
  if (user.bot) return;

  try {
    if (reaction.partial) {
      await reaction.fetch()
      }

      for (const listener of reactionListeners) {
        await listener.onMessageReaction(reaction, user)
      }
    }
    catch (err) {
      console.error('Error in reaction handler', err);
    }
};