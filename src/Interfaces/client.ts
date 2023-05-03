import { ApplicationCommandDataResolvable } from 'discord.js'

export interface RegisterCommandOptions {
    guildId: string | undefined;
    commands: ApplicationCommandDataResolvable[];
}