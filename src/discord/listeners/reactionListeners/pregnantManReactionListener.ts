import { MessageReaction, User } from "discord.js";
import { ReactionListener } from "../types";

const pregnantManReactionListener: ReactionListener = {
    onMessageReaction: async (reaction: MessageReaction, user: User) => {
        try {
            const emoji = reaction.emoji.name;
            if (emoji && emoji.startsWith(':pregnant_man:')) {
                await reaction.remove();
            }
        }
        catch (err) {
            if (err.code === 10014) return;
            console.error('Pregnant man reaction blocker handler error:', err)
        }
    }
}

export default pregnantManReactionListener;