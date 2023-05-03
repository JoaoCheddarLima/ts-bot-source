import { Interaction, CommandInteractionOptionResolver } from "discord.js";
import { Event } from "../Interfaces/events.js";
import { ExtendedInteraction } from "../Interfaces/command.js";

export const event: Event = {
    name: 'interactionCreate',
    run: async (client, interaction: Interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true })
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.editReply({ content: "Command doesn't exist!" })

            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction
            })
        }
    }
}