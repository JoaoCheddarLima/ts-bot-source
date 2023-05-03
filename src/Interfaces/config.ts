declare namespace NodeJS {
    export interface ProcessEnv {
        DISCORD_BOT_TOKEN: string;
        DISCORD_BOT_INVITE_URL: string | undefined;
        TEST_SERVER: string | undefined;

        USE_DB: 'yes' | 'no';

        MONGODB_CONNECTION_STRING: string | undefined;
    }
}