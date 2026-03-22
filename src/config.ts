import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig,
};

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    polkaKey: string;
}

type JWTConfig = {
    secret: string;
    expiresIn: number;
}

type RefreshTokenConfig = {
    expiresIn: number;
}

type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
    refreshToken: RefreshTokenConfig;
};

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"), // we just set to prod, staging, etc. when not dev
        polkaKey: envOrThrow("POLKA_KEY"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        secret: envOrThrow("JWT_SECRET"),
        expiresIn: 3600, // 1 hour
    },
    refreshToken: {
        expiresIn: 1000 * 60 * 60 * 24 * 60, // 60 days
    },
};
