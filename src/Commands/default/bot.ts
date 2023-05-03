import { ApplicationCommandOptionType } from 'discord.js';
import { jsonConfig } from '../../Interfaces/jsonConfig.js';
import { Command } from '../../Interfaces/command.js';
import { readFileSync, writeFileSync } from 'fs'

export const slash: Command = {
    name: 'bot',
    description: 'Says the actual ws ping',
    options: [
        {
            name: "username",
            description: "Sets the new bot username",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "nick",
                    description: "New username",
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        {
            name: "avatar",
            description: "Sets the new bot icon",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "avatar",
                    description: "New avatar",
                    required: true,
                    type: ApplicationCommandOptionType.Attachment
                }
            ]
        },
        {
            name: "status-add",
            description: "adds a new text on playing message!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "status",
                    description: "the text that sould be displayed on the status",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "status-remove",
            description: "removes a old text on playing message.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "status",
                    description: "the text that sould be removed",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "status-interval",
            description: "Changes the status refresh frequency timer",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "frequency",
                    description: "the time between refreshes in ms (min 1500)",
                    type: ApplicationCommandOptionType.Number,
                    min_value: 1500,
                    required: true
                }
            ]
        }
    ],
    testOnly: false,
    run: async ({ interaction }) => {

        if (!interaction.isChatInputCommand()) return

        const command = interaction.options.getSubcommand()

        if (command == 'username') {
            const name = interaction.options.getString("nick")

            if (!name) return

            return interaction.client.user.setUsername(name)
                .then(r => {
                    return interaction.reply({ content: `**Name changed successfully to: \`${name}\`**`, ephemeral: true })
                })
                .catch(err => {
                    return interaction.reply({ content: "Not possible to change, name is either too long or not available due to a high number of users that already use this nickname", ephemeral: true })
                })
        }

        if (command == 'avatar') {
            const avatarUrl = interaction.options.getAttachment("picture")?.url

            if (!avatarUrl) return

            return interaction.client.user.setAvatar(avatarUrl)
                .then(r => {
                    return interaction.reply({ content: `**Avatar changed successfully!**`, ephemeral: true })
                })
                .catch(err => {
                    interaction.reply({ content: "Unkow error, check if the file is a valid image.", ephemeral: true })
                })
        }

        const statusMessage = interaction.options.getString('status') || ''
        const statusInterval = interaction.options.getNumber('time') || 1500

        const readConfig = async (): Promise<jsonConfig> => await JSON.parse(readFileSync('./config.json', { encoding: 'utf-8' }))
        const writeConfig = async (data: jsonConfig) => writeFileSync('./config.json', JSON.stringify(data, null, 2))

        if (command == 'status-interval') {
            const config = await readConfig()

            config.status.cooldown = statusInterval

            await writeConfig(config)

            return interaction.editReply({ content: `**the timer \`${statusInterval}ms\` was set successfully for updating the status!**` })
        }

        if (command == 'status-add') {
            const config = await readConfig()

            config.status.texts.push(statusMessage)

            await writeConfig(config)

            return interaction.editReply({ content: `**\`${statusMessage}\` was added successfully!**` })
        }

        if (command == 'status-remove') {
            const config = await readConfig()

            const texts = config.status.texts

            if (!texts.includes(statusMessage)) return interaction.editReply({ content: `\`\`\`${statusMessage}\`\`\`Isn't on the current status messages.` })

            config.status.texts.splice(texts.indexOf(statusMessage), 1)

            await writeConfig(config)

            return interaction.editReply({ content: `**\`${statusMessage}\` was added successfully!**` })
        }
    }
}