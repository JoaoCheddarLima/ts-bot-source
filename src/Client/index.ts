import { Client, Collection, ApplicationCommandDataResolvable } from "discord.js";
import dotenv from 'dotenv'
dotenv.config()
import { Command, Event, RegisterCommandOptions } from '../Interfaces/index.js'
import { readdirSync } from 'fs'

class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config = process.env;
    public aliases: Collection<string, Command> = new Collection();

    public constructor() {
        super({
            intents: ['GuildMessages', 'GuildMembers', 'GuildWebhooks', 'Guilds', 'MessageContent']
        })
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.slash
    }

    async registerCommands({ commands, guildId }: RegisterCommandOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`[!]Registered commands at: ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log(`[!]Commands set for all guilds!`);
        }
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];

        const commandPath = './src/Commands'

        const commands = readdirSync(`${commandPath}`).filter(file => file.endsWith('.ts'))

        commands.forEach(async (file) => {
            const command: Command = await this.importFile(`../Commands/${file}`)
            if (!command.name) return;

            this.commands.set(command.name, command)
            slashCommands.push(command)
        })

        this.on('ready', () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.TEST_SERVER
            })
        })
    }

    public async init() {
        this.login(this.config.DISCORD_BOT_TOKEN)
        this.registerModules()

        if (!this.config.TEST_SERVER) console.log('[!]TEST SERVER IS NOT SET')

        const eventPath = './src/Events'

        readdirSync(eventPath).forEach(async (file) => {
            const { event } = await import(`../Events/${file}`)
            this.events.set(event.name, event)
            this.on(event.name, event.run.bind(null, this))
        })
    }
}

export default Bot