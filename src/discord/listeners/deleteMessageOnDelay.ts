import { Message } from 'discord.js';

import config from '../../config';

const impRegex = new RegExp('^(.*) imp on w([0-9]{3}) (.*)$');

const createMsgDeleteTimeout = async (
	message: Message, timeInMs : number,
	) =>{
		setTimeout(() => {
			message.delete().catch(error => {
				console.log(error);
				return;

			});
		}, timeInMs);
};

export const deleteMessageOnDelay = async (
	message : Message,
) => {
	if (message.author.bot){
		createMsgDeleteTimeout(message, config.delete_message_on_delay.time_ms);
		return;
	}
	
	var messageParts = impRegex.exec(message.content.toLowerCase());
	
	if(message.channelId == config.delete_message_on_delay.channel_id 
		&& messageParts != null){
			createMsgDeleteTimeout(message, config.delete_message_on_delay.time_ms);
	}
	else if(message.channelId == config.delete_message_on_delay.channel_id 
		&& messageParts == null){
			var replyMessage = message.reply("Please use the format X imp on wX #description_here#. Example: Lucky imp on w420 somewhere in Morytania");
			createMsgDeleteTimeout(message, 100);
	}
};