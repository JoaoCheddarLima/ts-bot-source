import { Client, Collection, ApplicationCommandDataResolvable } from "discord.js";
import dotenv from 'dotenv'
dotenv.config()
import { Command, Event, RegisterCommandOptions } from '../Interfaces/index.js'
import { readdirSync } from 'fs'

type commandsLoaded = {
    file: string;
    path: string;
    relativePath: string;
}

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
            console.log(`\n[!]${commands.length} Commands registered at: ${guildId}\n`);
        } else {
            this.application?.commands.set(commands);
            console.log(`\n[!]${commands.length} Commands set for all guilds!\n`);
        }
        console.log(`[!]Listening to events: ${this.events.map(({ name }) => name)}`)
        console.log(`[!]Enabled intents: ${this.options.intents.toArray()}`)
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];

        const commandPath = './src/Commands'

        function readCommandsFromDir(dir: string): commandsLoaded[] {

            const dirItems = readdirSync(`${dir}`)

            const commands: commandsLoaded[] = []

            for (const file of dirItems) {
                if (file.endsWith('.ts')) {
                    commands.push({
                        file: file,
                        path: dir,
                        relativePath: dir.split('./src/Commands')[1] == '' ? '/' : dir.split('./src/Commands')[1]
                    })
                }
            }

            const folders = dirItems.filter(file => !file.endsWith('.ts'))

            if (folders.length > 0) {
                const foundCommands: commandsLoaded[] = []

                for (const folder of folders) {
                    const fcommands = readCommandsFromDir(`${commandPath}/${folder}`)

                    for (const fcommand of fcommands) {
                        foundCommands.push(fcommand)
                    }
                }
                return commands.concat(foundCommands)
            }
            return commands

        }

        const commands = readCommandsFromDir(commandPath)

        for (const { file, path, relativePath } of commands) {
            try {
                console.log(`[!]Importing command: ../Commands${relativePath}${relativePath === '/' ? '' : '/'}${file}`)
                const command: Command = await this.importFile(`../Commands${relativePath}${relativePath === '/' ? '' : '/'}${file}`)
                if (!command.name) return;
                console.log(`[!]Successfully imported > ${command.name} <`)

                this.commands.set(command.name, command)
                slashCommands.push(command)

            } catch (err) {
                console.log(`[!]Error while importing last command! + ${err}`)
            }
        }

        this.registerCommands({
            commands: slashCommands,
            guildId: process.env.TEST_SERVER
        })
    }

    public async init() {
        const eventPath = './src/Events'

        const events = readdirSync(eventPath)

        for (const file of events) {
            const { event } = await import(`../Events/${file}`)
            this.events.set(event.name, event)
            this.on(event.name, event.run.bind(null, this))
        }

        await this.login(this.config.DISCORD_BOT_TOKEN)

        if (!this.config.TEST_SERVER) console.log('[!]TEST SERVER NOT SET')

        await this.registerModules()
    }
}

export default Bot