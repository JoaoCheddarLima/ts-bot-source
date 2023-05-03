import { Message, Embed, Permissions, ChannelType } from 'discord.js'
import dotenv from 'dotenv'
import { Event } from '../Interfaces/events.js'

export const event: Event = {
    name: 'messageCreate',
    run: async (client, message: Message) => {
        if (message.channel.type === ChannelType.DM) return;
        if (message.author.bot) return;

        console.log(message)

        if (message.content === '!ping') message.reply({ content: `pong!, ${client.ws.ping}` })
    }
}