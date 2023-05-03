import { Command } from "../../Interfaces/command.js";

export const slash: Command = {
    name: "ping",
    description: "Says the actual ws ping",
    testOnly: false,
    run: ({ interaction }) => {
        return interaction.followUp({ content: `pings is ${interaction.client.ws.ping}ms` })
    }
}