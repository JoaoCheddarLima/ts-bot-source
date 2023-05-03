import { Event } from '../Interfaces/index.js'

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log(`[!]App is online as: [${client.user?.username}#${client.user?.tag}]`)
    }
}