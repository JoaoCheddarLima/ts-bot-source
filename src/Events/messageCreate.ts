import { Message, ChannelType } from 'discord.js'
import { Event } from '../Interfaces/events.js'

export const event: Event = {
    name: 'messageCreate',
    run: async (client, message: Message) => {
        if (message.channel.type === ChannelType.DM) return;
        if (message.author.bot) return;

        if (message.content === '!ping') message.reply({ content: `pong!, ${client.ws.ping}` })
    }
}