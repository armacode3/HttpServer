import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

const dbUrl = () => {
    if (process.env["DB_URL"] !== undefined) {
        return process.env["DB_URL"];
    } else {
        throw new Error("DB_URL does not exist");
    }
};

const platform = () => {
    if (process.env["PLATFORM"] !== undefined) {
        return process.env["PLATFORM"];
    } else {
        throw new Error("PLATFORM does not exist");
    }
}

const secret = () => {
    if (process.env["SECRET"] !== undefined) {
        return process.env["SECRET"];
    } else {
        throw new Error("SECRET does not exist");
    }
}

export type APIConfig = {
    fileServerHits: number;
    dbURL: string;
    platform: string;
    secret: string;
};

export type DBConfig = {
    dbURL: string;
    config: MigrationConfig;
};

type Config = {
    dbConfig: DBConfig;
    apiConfig: APIConfig;
};

export const config: Config = {
    dbConfig: {
        dbURL: dbUrl(),
        config: {
            migrationsFolder: "./src/db/migrations",
        },
    },
    apiConfig: {
        fileServerHits: 0,
        dbURL: dbUrl(),
        platform: platform(),
        secret: secret(),
    }
};

