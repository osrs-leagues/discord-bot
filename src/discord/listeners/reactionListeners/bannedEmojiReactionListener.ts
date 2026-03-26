import { MessageReaction } from 'discord.js';
import { ReactionListener } from '../types';

const BANNED_EMOJIS = ['🫃', '🫃🏻', '🫃🏼', '🫃🏽', '🫃🏾', '🫃🏿'];

const bannedEmojiReactionListener: ReactionListener = {
  onMessageReaction: (reaction: MessageReaction) => {
    try {
      const emoji = reaction.emoji.name;
      if (BANNED_EMOJIS.includes(emoji)) {
        reaction.remove().catch((err) => {
          if (err.code === 10014) return;
          console.error('Error removing banned emoji reaction:', err);
        });
      }
    } catch (err) {
      console.error('Banned emoji reaction handler error:', err);
    }
  },
};

export default bannedEmojiReactionListener;
