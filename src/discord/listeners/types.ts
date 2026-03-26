import { Message, MessageReaction, User } from 'discord.js';

export type ChannelListener = {
  channels: string[];
  excludedRoles?: string[];
  onChannelMessage: (message: Message) => void;
};

export type ReactionListener = {
  onMessageReaction: (reaction: MessageReaction, user: User) => void;
};
