import dotenv from 'dotenv'
import { IntentsBitField, Client } from 'discord.js'

dotenv.config()

const applicationIntents = new IntentsBitField().add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
)

const client = new Client({ intents: applicationIntents })

try {
    await client.login(process.env.DISCORD_BOT_TOKEN)
    console.log(`[!] Application ${client.user?.username}#${client.user?.tag} on discord!`)
} catch (err) {
    console.error(`Bot login error: ${err}`)
}