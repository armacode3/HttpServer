process.loadEnvFile();
const dbUrl = () => {
    if (process.env["DB_URL"] !== undefined) {
        return process.env["DB_URL"];
    }
    else {
        throw new Error("DB_URL does not exist");
    }
};
const platform = () => {
    if (process.env["PLATFORM"] !== undefined) {
        return process.env["PLATFORM"];
    }
    else {
        throw new Error("PLATFORM does not exist");
    }
};
export const config = {
    dbConfig: {
        dbURL: dbUrl(),
        config: {
            migrationsFolder: "./src/db/migrations",
        },
    },
    apiConfig: {
        fileServerHits: 0,
        dbURL: dbUrl(),
        platform: platform()
    }
};
