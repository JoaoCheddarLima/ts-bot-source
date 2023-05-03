import { Event } from '../Interfaces/index.js'
import dotenv from 'dotenv'
dotenv.config()

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log(`[!]Bot Status: ONLINE as [${client.user?.tag}]`)
        if (process.env.USE_DB?.toLowerCase() == 'yes') {

        } else {
            console.log(`\n[!]No database mode enabled, local json will be used instead.`)
        }
    }
}