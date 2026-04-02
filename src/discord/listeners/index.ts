import { Message, MessageReaction, User } from 'discord.js';
import impSpottingListener from './messageListeners/impSpottingListener';
import challengeApprovalMessageListener from './messageListeners/challengeApprovalListener';
import bannedEmojiReactionListener from './reactionListeners/bannedEmojiReactionListener';
import handleDirectMessage from './dmMessageListener';
import handleThreadReply from './appealThreadReplyListener';

const messageListeners = [
  impSpottingListener,
  challengeApprovalMessageListener,
];

const reactionListeners = [bannedEmojiReactionListener];

export const handleMessageCreate = (message: Message) => {
  const validChannels = messageListeners.filter((listener) =>
    listener.channels.includes(message.channelId),
  );
  validChannels.forEach((channel) => channel.onChannelMessage(message));
};

export { handleDirectMessage, handleThreadReply };

export const handleReactionAdd = async (
  reaction: MessageReaction,
  user: User,
) => {
  if (user.bot) return;

  try {
    if (reaction.partial) {
      await reaction.fetch();
    }

    for (const listener of reactionListeners) {
      listener.onMessageReaction(reaction, user);
    }
  } catch (err) {
    console.error('Error in reaction handler', err);
  }
};
