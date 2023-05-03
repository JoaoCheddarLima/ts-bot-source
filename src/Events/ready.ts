import { Event } from '../Interfaces/index.js'

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log(client.user?.username, 'Is online')
    }
}